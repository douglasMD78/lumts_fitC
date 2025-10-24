"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext'; // Adicionando esta linha

interface CommonServing {
  unit: string;
  grams: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size_grams: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  cholesterol: number | null;
  saturated_fat: number | null;
  trans_fat: number | null;
  calcium: number | null;
  iron: number | null;
  vitamin_a: number | null;
  vitamin_c: number | null;
  category: string | null;
  source: string;
  external_id: string | null;
  common_servings: CommonServing[] | null;
  user_id: string | null; // Adicionado para consistência
}

const fetchFoods = async (searchTerm: string, accessToken: string | undefined): Promise<Food[]> => {
  console.log('useSearchFoods: fetchFoods called with searchTerm:', searchTerm, 'accessToken present:', !!accessToken);

  if (searchTerm.length < 2) {
    console.log('useSearchFoods: searchTerm too short, returning empty array.');
    return [];
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/search-foods`;
  console.log('useSearchFoods: Calling Edge Function directly at URL:', edgeFunctionUrl);
  console.log('useSearchFoods: Request body being sent:', JSON.stringify({ searchTerm: searchTerm }));

  try {
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ searchTerm: searchTerm }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('useSearchFoods: Error response from Edge Function:', response.status, errorText);
      throw new Error(`Edge Function error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('useSearchFoods: Successful response from Edge Function:', data);
    return data?.foods || [];
  } catch (error: any) {
    console.error('useSearchFoods: Error during fetch to Edge Function:', error);
    throw new Error('Erro ao buscar alimentos: ' + error.message);
  }
};

export const useSearchFoods = (searchTerm: string) => {
  const { session } = useAuth();

  return useQuery<Food[], Error>({
    queryKey: ['searchFoods', searchTerm, session?.access_token],
    queryFn: () => fetchFoods(searchTerm, session?.access_token),
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};