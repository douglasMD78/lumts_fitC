"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

interface AvatarUploadData {
  uid: string;
  file: File;
}

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, AvatarUploadData>({
    mutationFn: async ({ uid, file }) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}/avatar.${fileExt}`;

      // Upload do novo avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Obter a URL pública do avatar
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = publicUrlData.publicUrl;

      // Atualizar o avatar_url no perfil do usuário no banco de dados
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() })
        .eq('id', uid);

      if (updateError) {
        throw new Error(updateError.message);
      }
      return newAvatarUrl;
    },
    onSuccess: (_newAvatarUrl, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.uid] });
      showSuccess('Avatar atualizado com sucesso! 🎉');
    },
    onError: (error) => {
      showError('Erro ao fazer upload do avatar: ' + error.message);
    },
  });
};