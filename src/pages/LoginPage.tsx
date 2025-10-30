"use client";

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome } from 'lucide-react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Importar os novos hooks
import { useLogin } from '@/hooks/useLogin';
import { useResendConfirmationEmail } from '@/hooks/useResendConfirmationEmail';
import { useLoginWithGoogle } from '@/hooks/useLoginWithGoogle';

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showResend, setShowResend] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();
  const resendConfirmationMutation = useResendConfirmationEmail();
  const loginWithGoogleMutation = useLoginWithGoogle();

  const onSubmit = async (data: LoginFormInputs) => {
    setShowResend(false);
    setUnconfirmedEmail(null);

    try {
      await loginMutation.mutateAsync({ email: data.email, password: data.password });
    } catch (error: any) {
      if (error.message.includes('Email not confirmed')) {
        setShowResend(true);
        setUnconfirmedEmail(data.email);
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (!unconfirmedEmail) return;
    resendConfirmationMutation.mutate({ email: unconfirmedEmail });
  };

  const handleGoogleLogin = async () => {
    loginWithGoogleMutation.mutate();
  };

  const isLoading = loginMutation.isPending || resendConfirmationMutation.isPending || loginWithGoogleMutation.isPending;

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-3">Bem-vinda de Volta!</h2>
          <p className="text-pink-600 text-base">Acesse sua jornada</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-pink-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-pink-700">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            <div className="text-right text-sm">
              <Link to="/forgot-password" className="font-medium text-pink-500 hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
          <Button type="submit" className="btn-calculate" disabled={isLoading}>
            {isLoading ? 'Entrando...' : '✨ Entrar'}
          </Button>

          {showResend && unconfirmedEmail && (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-yellow-50 text-yellow-700 font-bold py-4 rounded-2xl border-2 border-yellow-200 hover:bg-yellow-100 transition-all duration-300 h-auto text-base"
              onClick={handleResendConfirmation}
              disabled={isLoading}
            >
              Reenviar Confirmação de E-mail
            </Button>
          )}

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 font-bold py-4 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 h-auto text-base"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="h-5 w-5" /> Entrar com Google
          </Button>

          <p className="text-center text-sm text-slate-600 mt-6">
            Não tem uma conta?{' '}
            <Link to="/signup" className="font-bold text-pink-500 hover:underline">
              Crie uma agora!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;