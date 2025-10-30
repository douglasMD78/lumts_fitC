"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import *as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';

// Importar o novo hook
import { useUpdatePassword } from '@/hooks/useUpdatePassword';

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string().min(6, { message: 'Confirme sua nova senha' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type UpdatePasswordFormInputs = z.infer<typeof updatePasswordSchema>;

const UpdatePasswordPage = () => {
  const [sessionConfirmed, setSessionConfirmed] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormInputs>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const updatePasswordMutation = useUpdatePassword();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionConfirmed(true);
      } else {
        // showError("Sessão de redefinição de senha inválida ou expirada. Por favor, tente novamente."); // Comentado para evitar toast duplicado se o hook já mostrar
        navigate('/forgot-password');
      }
    };
    checkSession();
  }, [navigate]);

  const onSubmit = async (data: UpdatePasswordFormInputs) => {
    updatePasswordMutation.mutate({ password: data.password });
  };

  if (!sessionConfirmed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verificando sessão de redefinição...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <Lock className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Defina Sua Nova Senha</h2>
          <p className="text-pink-600 text-base">Crie uma senha forte e segura.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-pink-700">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha forte"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-semibold text-pink-700">Confirme a Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="btn-calculate" disabled={updatePasswordMutation.isPending}>
            {updatePasswordMutation.isPending ? 'Atualizando...' : 'Atualizar Senha'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;