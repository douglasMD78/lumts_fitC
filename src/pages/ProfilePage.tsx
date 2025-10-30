import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUpload from '@/components/AvatarUpload';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useLogout } from "@/hooks/useLogout";
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import *as z from 'zod';

// Definir o schema Zod para validação do perfil
const profileSchema = z.object({
  first_name: z.string().min(1, "Primeiro nome é obrigatório.").max(50, "Primeiro nome muito longo.").nullable(),
  last_name: z.string().min(1, "Último nome é obrigatório.").max(50, "Último nome muito longo.").nullable(),
  age: z.coerce.number().min(1, "Idade deve ser maior que 0").max(120, "Idade inválida").nullable().optional(),
  weight: z.coerce.number().min(10, "Peso deve ser maior que 0").max(300, "Peso inválido").nullable().optional(),
  height: z.coerce.number().min(50, "Altura deve ser maior que 0").max(250, "Altura inválida").nullable().optional(),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const { data: profileData, isLoading: loadingProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile(user?.id || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: null,
      last_name: null,
      age: null,
      weight: null,
      height: null,
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        first_name: profileData.first_name || null,
        last_name: profileData.last_name || null,
        age: profileData.age,
        weight: profileData.weight,
        height: profileData.height,
      });
    }
  }, [profileData, reset]);

  const onSubmit = (data: ProfileFormInputs) => {
    if (!user) return;

    updateProfileMutation.mutate({
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      age: data.age ?? null,
      weight: data.weight ?? null,
      height: data.height ?? null,
    });
  };

  const handleAvatarUpload = (newUrl: string | null) => {
    // A URL do avatar é gerenciada pelo useUserProfile, então apenas invalidamos o cache
    // para que o useUserProfile refetch e atualize o componente.
    // Não precisamos de um estado local para avatar_url aqui.
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Você precisa estar logada para ver esta página.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Meu Perfil</h1>
          <p className="text-slate-600">Gerencie suas informações pessoais e preferências</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {user && (
                    <AvatarUpload 
                      uid={user.id} 
                      initialAvatarUrl={profileData?.avatar_url || null} 
                      onUpload={handleAvatarUpload} 
                    />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Primeiro Nome</Label>
                      <Input 
                        id="firstName" 
                        {...register('first_name')} 
                        placeholder="Seu primeiro nome"
                        className={errors.first_name ? 'border-red-500' : ''}
                      />
                      {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Último Nome</Label>
                      <Input 
                        id="lastName" 
                        {...register('last_name')} 
                        placeholder="Seu último nome"
                        className={errors.last_name ? 'border-red-500' : ''}
                      />
                      {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age">Idade</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        {...register('age', { valueAsNumber: true })} 
                        placeholder="Sua idade"
                        className={errors.age ? 'border-red-500' : ''}
                      />
                      {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input 
                        id="weight" 
                        type="number" 
                        step="0.1" 
                        {...register('weight', { valueAsNumber: true })} 
                        placeholder="Seu peso"
                        className={errors.weight ? 'border-red-500' : ''}
                      />
                      {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Altura (cm)</Label>
                      <Input 
                        id="height" 
                        type="number" 
                        {...register('height', { valueAsNumber: true })} 
                        placeholder="Sua altura"
                        className={errors.height ? 'border-red-500' : ''}
                      />
                      {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Minha Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Membro desde</p>
                    <p className="font-medium">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={logout}
                  >
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;