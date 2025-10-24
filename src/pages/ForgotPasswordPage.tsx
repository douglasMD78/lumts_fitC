"use client";

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';

// Importar o novo hook
import { useForgotPassword } from '@/hooks/useForgotPassword';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [messageSent, setMessageSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email });
      setMessageSent(true);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <Mail className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Esqueceu Sua Senha?</h2>
          <p className="text-pink-600 text-base">Não se preocupe! Digite seu e-mail para redefinir.</p>
        </div>

        {!messageSent ? (
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
            <Button type="submit" className="btn-calculate" disabled={forgotPasswordMutation.isPending}>
              {forgotPasswordMutation.isPending ? 'Enviando...' : 'Redefinir Senha'}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Lembrou da sua senha?{' '}
              <Link to="/login" className="font-bold text-pink-500 hover:underline">
                Fazer Login
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg text-slate-700">
              Verifique seu e-mail para o link de redefinição de senha.
            </p>
            <p className="text-sm text-slate-500">
              Se você não receber o e-mail em alguns minutos, verifique sua pasta de spam.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Voltar para o Login</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;