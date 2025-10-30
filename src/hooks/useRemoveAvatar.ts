"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface AvatarRemoveData {
  uid: string;
  avatarUrl: string;
}

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AvatarRemoveData>({
    mutationFn: async ({ uid, avatarUrl }) => {
      // Extrair o caminho do arquivo do URL público
      const urlParts = avatarUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${uid}/${fileName}`;

      // Deletar o arquivo do storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Remover o avatar_url do perfil do usuário no banco de dados
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', uid);

      if (updateError) {
        throw new Error(updateError.message);
      }
    },
    onSuccess: (_data, variables) => { // 'data' is the result of mutation, 'variables' is the input
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.uid] });
      showSuccess('Avatar removido com sucesso!');
    },
    onError: (error) => {
      showError('Erro ao remover avatar: ' + error.message);
    },
  });
};