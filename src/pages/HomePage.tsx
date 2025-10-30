import { Link } from "react-router-dom";
import { Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import StoriesSection from "@/components/StoriesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { showError } from "@/utils/toast";
import BlogCard from '@/components/BlogCard';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';
import DynamicHeroBanner from "@/components/DynamicHeroBanner"; // Import the new DynamicHeroBanner
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

  const { data: blogPosts, isLoading: loadingBlogPosts, isError: blogPostsError, error: blogPostsFetchError } = useQuery<BlogPost[], Error>({
    queryKey: ['homeBlogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 10,
    onError: (error: Error) => {
      showError('Erro ao carregar posts do blog: ' + error.message);
    },
  });

  useEffect(() => {
    if (blogPostsError) {
      showError('Erro ao carregar posts do blog: ' + blogPostsFetchError?.message);
    }
  }, [blogPostsError, blogPostsFetchError]);

  return (
    <div className="container mx-auto px-4 pt-8 pb-16 flex flex-col items-center space-y-12">
      {/* Seção 1: O "Hero" (Acima da Dobra) */}
      <section className="w-full max-w-4xl text-center px-6 py-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-4">
          A calculadora de macros que eu uso para <span className="gradient-text">resultados reais</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Descubra suas calorias e macros em 60 segundos com nossa ferramenta 100% gratuita.
        </p>
        <Button asChild size="lg" className="btn-calculate">
          <Link to="/calculadora-macros">CALCULAR MEUS MACROS AGORA</Link>
        </Button>
      </section>

      {/* Seção 2: Venda #1 (Ebook - O Carro-Chefe) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-200">
        <DynamicHeroBanner
          slug="banner_home_ebook"
          defaultTitle="Ebook Exclusivo: Receitas e Estratégias"
          defaultDescription="Acesse nosso guia completo com receitas deliciosas e saudáveis para sua dieta."
          defaultLink="/ebook"
          buttonText="VER EBOOK"
        />
      </section>

      {/* Seção 3: Ferramentas (A Identidade Visual) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-300">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Explore nossas ferramentas</h2>
        <StoriesSection />
      </section>

      {/* Seção 4: Venda #2 (Desafio ou Guia - CMS) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-400">
        <DynamicHeroBanner
          slug="banner_home_desafio_guia"
          defaultTitle="Participe do Nosso Próximo Desafio!"
          defaultDescription="Mantenha-se motivada e alcance resultados incríveis com a comunidade LumtsFit."
          defaultLink="/desafios"
          buttonText="VER DESAFIO"
        />
      </section>

      {/* Seção 5: SEO (Blog) */}
      <section className="w-full max-w-4xl animate-fade-in-up animation-delay-500">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Últimas do Blog</h2>
        {loadingBlogPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
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