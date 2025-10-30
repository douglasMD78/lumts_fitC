"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

export interface DynamicContent {
  slug: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const fetchDynamicContent = async (slug: string): Promise<DynamicContent | null> => {
  const { data, error } = await supabase
    .from('dynamic_content')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true) // Only fetch active content
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    throw new Error(error.message);
  }
  return data || null;
};

export const useDynamicContent = (slug: string) => {
  return useQuery({ // Updated syntax
    queryKey: ['dynamicContent', slug],
    queryFn: () => fetchDynamicContent(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    onError: (error: Error) => { // Updated error type
      console.error(`Erro ao carregar conteúdo dinâmico para slug '${slug}':`, error.message);
      // showError(`Erro ao carregar conteúdo dinâmico: ${error.message}`); // Optional: show toast for user
    },
  });
};