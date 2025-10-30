import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import StoriesSection from "@/components/StoriesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { showError } from "@/utils/toast";
import BlogCard from '@/components/BlogCard';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';
import DynamicHeroBanner from "@/components/DynamicHeroBanner"; // Usar o novo DynamicHeroBanner
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
}

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, category, excerpt, cover_image_url, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const HomePage = () => {
  const { user } = useAuth();
  const { data: profileData } = useUserProfile();
  const userName = profileData?.first_name || user?.email?.split('@')[0] || 'Usuária';

  const { data: blogPosts, isLoading: loadingBlogPosts, isError: blogPostsError, error: blogPostsFetchError } = useQuery<BlogPost[], Error, BlogPost[], (string)[]>({
    queryKey: ['homeBlogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (blogPostsError) {
      showError('Erro ao carregar posts do blog: ' + blogPostsFetchError?.message);
    }
  }, [blogPostsError, blogPostsFetchError]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center space-y-10"> {/* Adicionado space-y-10 */}
      {/* Seção 1: Acolhimento (com a "Voz" da Luiza) */}
      <section className="w-full max-w-4xl text-center px-6 py-4 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-6">
          {user?.first_name ? `Olá, ${userName}!` : 'Bem-vinda ao nosso espaço'}
        </h1>
      </section>

      {/* Seção 2: Venda #1 (O Ebook - Lindo e Contextual) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-200">
        <DynamicHeroBanner
          slug="banner_home_ebook"
          defaultTitle="Ebook Exclusivo: Receitas e Estratégias"
          defaultDescription="Acesse nosso guia completo com receitas deliciosas e saudáveis para sua dieta."
          defaultLink="/ebook"
          buttonText="VER EBOOK"
          defaultImage="/placeholder.svg" // Adicione uma imagem padrão se não houver no CMS
        />
      </section>

      {/* Seção 3: Navegação (A Identidade - Stories) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-300">
        <StoriesSection />
      </section>

      {/* Seção 4: A "Isca" (CTA de Macros - com Destaque) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-400">
        <Card className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-2xl shadow-lg border border-pink-100">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-bold">Precisando de um norte na dieta?</h2>
            <p className="text-base text-white/90">A nossa calculadora de macros gratuita é o primeiro passo para você entender exatamente o que precisa comer.</p>
            <Button asChild variant="secondary" size="lg" className="bg-white text-pink-500 hover:bg-gray-100 font-bold rounded-full px-8 py-4 h-auto text-lg shadow-lg">
              <Link to="/calculadora-macros" className="flex items-center justify-center">
                <Calculator className="h-5 w-5 mr-2" /> Começar a Calcular
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Seção 5: Venda Secundária (Desafio ou Guia - CMS) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-500">
        <DynamicHeroBanner
          slug="banner_home_desafio_guia"
          defaultTitle="Participe do Nosso Próximo Desafio!"
          defaultDescription="Mantenha-se motivada e alcance resultados incríveis com a comunidade LumtsFit."
          defaultLink="/desafios"
          buttonText="VER DESAFIO"
          defaultImage="/placeholder.svg" // Adicione uma imagem padrão se não houver no CMS
        />
      </section>

      {/* Seção 6: SEO (Blog) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-600">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Últimas do Blog</h2>
        {loadingBlogPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post: BlogPost) => (
              <BlogCard
                key={post.id}
                image={post.cover_image_url || '/placeholder.svg'}
                category={post.category || 'Geral'}
                title={post.title}
                excerpt={post.excerpt || 'Leia mais sobre este tópico interessante!'}
                slug={post.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center">Nenhum post de blog disponível no momento.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;