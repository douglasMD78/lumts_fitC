"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { showSuccess, showError } from '@/utils/toast';
import { useUpdateAvatar } from '@/hooks/useUpdateAvatar'; // Importar o novo hook
import { useRemoveAvatar } from '@/hooks/useRemoveAvatar'; // Importar o novo hook

interface AvatarUploadProps {
  uid: string;
  initialAvatarUrl: string | null;
  onUpload: (url: string | null) => void;
}

const AvatarUpload = ({ uid, initialAvatarUrl, onUpload }: AvatarUploadProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);

  const updateAvatarMutation = useUpdateAvatar();
  const removeAvatarMutation = useRemoveAvatar();

  useEffect(() => {
    setAvatarUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      showError('Por favor, selecione uma imagem para upload.');
      return;
    }

    const file = event.target.files[0];
    updateAvatarMutation.mutate(
      { uid, file },
      {
        onSuccess: (newUrl) => {
          setAvatarUrl(newUrl);
          onUpload(newUrl);
        },
      }
    );
  };

  const handleRemove = async () => {
    if (!avatarUrl) return;

    removeAvatarMutation.mutate(
      { uid, avatarUrl },
      {
        onSuccess: () => {
          setAvatarUrl(null);
          onUpload(null);
        },
      }
    );
  };

  const uploading = updateAvatarMutation.isPending || removeAvatarMutation.isPending;

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar do Usuário" />
        <AvatarFallback className="bg-pink-100 text-pink-500">
          <UserIcon className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center space-y-2">
        <Label htmlFor="avatar-upload" className="cursor-pointer">
          <Button asChild disabled={uploading}>
            <span>{uploading ? 'Enviando...' : 'Mudar Avatar'}</span>
          </Button>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </Label>
        {avatarUrl && (
          <Button variant="destructive" onClick={handleRemove} disabled={uploading}>
            Remover Avatar
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;