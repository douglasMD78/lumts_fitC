"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast'; // Importar showError

interface Ebook {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  download_url: string;
}

const fetchEbooks = async (): Promise<Ebook[]> => {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const useEbooks = () => {
  return useQuery({ // Updated syntax
    queryKey: ['ebooks'],
    queryFn: fetchEbooks,
    enabled: true,
    staleTime: 1000 * 60 * 10,
    onError: (error: Error) => { // Updated error type
      showError('Erro ao carregar ebooks: ' + error.message);
    },
  });
};