import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URL da sua nova API externa
const EXTERNAL_FOOD_API_URL = "https://qjh9iec35mdd.manus.space/";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let searchTerm: string;
  let token: string | undefined;
  let userId: string | undefined;

  try {
    const rawBody = await req.text();
    let requestBody: any;

    if (!rawBody || rawBody.length === 0) {
      return new Response(JSON.stringify({ error: 'Request body is empty.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      requestBody = JSON.parse(rawBody);
      searchTerm = requestBody.searchTerm;
    } catch (jsonError) {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization');
    token = authHeader?.replace('Bearer ', '');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error: Supabase credentials missing.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      }
    );

    if (token) {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
      if (userError) {
        console.warn('Edge Function: Could not get user from token:', userError.message);
      } else if (user) {
        userId = user.id;
      }
    }

    if (!searchTerm || searchTerm.length < 2) {
      return new Response(JSON.stringify({ foods: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let allFoods: any[] = [];

    // 1. Buscar alimentos da API externa
    try {
      const externalApiResponse = await fetch(EXTERNAL_FOOD_API_URL);
      if (!externalApiResponse.ok) {
        throw new Error(`Failed to fetch from external API: ${externalApiResponse.statusText}`);
      }
      const externalFoods = await externalApiResponse.json();
      
      // Filtrar os alimentos da API externa pelo searchTerm
      const filteredExternalFoods = externalFoods.filter((food: any) => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      allFoods = [...filteredExternalFoods];
    } catch (externalApiError) {
      console.error('Edge Function: Erro ao buscar alimentos da API externa:', externalApiError);
      // Não falhar a requisição inteira se a API externa falhar, apenas logar o erro
    }

    // 2. Buscar alimentos personalizados do usuário no Supabase (se houver um userId)
    if (userId) {
      const { data: customFoods, error: customFoodsError } = await supabaseClient
        .from('foods')
        .select('*')
        .eq('user_id', userId)
        .eq('source', 'user_custom')
        .textSearch('tsv', searchTerm, {
          type: 'websearch',
          config: 'portuguese',
        })
        .limit(10); // Limite para alimentos personalizados

      if (customFoodsError) {
        console.error('Edge Function: Erro ao buscar alimentos personalizados:', customFoodsError.message);
      } else {
        allFoods = [...allFoods, ...(customFoods || [])];
      }
    }

    // Remover duplicatas (se um alimento da API externa tiver o mesmo nome de um personalizado, por exemplo)
    const uniqueFoods = Array.from(new Map(allFoods.map(food => [food.name.toLowerCase(), food])).values());

    return new Response(JSON.stringify({ foods: uniqueFoods }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Edge Function: Erro inesperado na search-foods:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return new Response(JSON.stringify({ error: 'Erro interno do servidor ao buscar alimentos: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});