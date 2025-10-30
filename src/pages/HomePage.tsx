import { Link } from "react-router-dom";
import { Calculator, Sparkles, BookOpen, GlassWater, Dumbbell, LayoutDashboard, Scale, Lightbulb, ArrowRight } from "lucide-react"; // Removed many unused icons
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import StoriesSection from "@/components/StoriesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { showError } from "@/utils/toast";
import DynamicBanner from "@/components/DynamicBanner"; // Import DynamicBanner
import { useQuery } from '@tanstack/react-query'; // Import useQuery for blog posts
import { supabase } from '@/integrations/supabase/client'; // Added missing import

// Removed imports for useLatestMacroPlan and useHomeSummaryData as they are no longer used directly here

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
    .limit(3); // Limit to 3 for the home page preview

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const HomePage = () => {
  const { user } = useAuth();
  const { data: profileData } = useUserProfile();
  const userName = profileData?.first_name || user?.email?.split('@')[0] || 'Usuária';

  // Fetch blog posts for SEO section
  const { data: blogPosts, isLoading: loadingBlogPosts, isError: blogPostsError, error: blogPostsFetchError } = useQuery<BlogPost[], Error>({
    queryKey: ['homeBlogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    onError: (error: Error) => { // Added error type
      showError('Erro ao carregar posts do blog: ' + error.message);
    },
  });

  useEffect(() => {
    if (blogPostsError) {
      showError('Erro ao carregar posts do blog: ' + blogPostsFetchError?.message);
    }
  }, [blogPostsError, blogPostsFetchError]);

  return (
    <div className="container mx-auto px-4 pt-8 pb-16 flex flex-col items-center">
      {/* Hero Section: Macro Calculator CTA */}
      <section className="w-full max-w-4xl text-center mb-12 animate-fade-in-up">
        <Card className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-2xl shadow-xl shadow-pink-500/20 p-8 md:p-12">
          <CardHeader className="pb-4">
            <Calculator className="h-20 w-20 mx-auto mb-4" />
            <CardTitle className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Descubra Seus Macros e Transforme Seu Corpo!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Calcule suas necessidades nutricionais diárias e receba um plano personalizado para emagrecer, ganhar massa ou manter seu peso.
            </p>
            <Button asChild variant="secondary" className="bg-white text-pink-500 hover:bg-gray-100 font-bold rounded-full px-10 py-5 h-auto text-xl shadow-lg">
              <Link to="/calculadora-macros">CALCULAR MEUS MACROS AGORA</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Section de Venda #1: Banner Dinâmico para Ebook */}
      <section className="w-full max-w-4xl mb-12 animate-fade-in-up animation-delay-200">
        <DynamicBanner
          slug="banner_home_ebook"
          defaultTitle="Ebook Exclusivo: Receitas e Estratégias"
          defaultDescription="Acesse nosso guia completo com receitas deliciosas e saudáveis para sua dieta."
          defaultLink="/ebook"
          buttonText="VER EBOOK"
          variant="default"
          colorClass="bg-white text-slate-800"
        />
      </section>

      {/* Seção "Nossas Ferramentas" */}
      <section className="w-full max-w-4xl mb-12 animate-fade-in-up animation-delay-300">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Nossas Ferramentas</h2>
        <StoriesSection /> {/* StoriesSection will be updated to reflect new tools */}
      </section>

      {/* Section de Venda #2: Banner Dinâmico para Desafio/Guia */}
      <section className="w-full max-w-4xl mb-12 animate-fade-in-up animation-delay-400">
        <DynamicBanner
          slug="banner_home_desafio_guia"
          defaultTitle="Participe do Nosso Próximo Desafio!"
          defaultDescription="Mantenha-se motivada e alcance resultados incríveis com a comunidade LumtsFit."
          defaultLink="/desafios"
          buttonText="VER DESAFIO"
          variant="default"
          colorClass="bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-purple-300/30"
        />
      </section>

      {/* Seção de SEO: Prévia dos posts do BlogPage */}
      <section className="w-full max-w-4xl mb-12 animate-fade-in-up animation-delay-500">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Últimas do Blog</h2>
        {loadingBlogPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 w-1/4"></div>
                    <div className="h-6 bg-gray-200 w-full"></div>
                    <div className="h-4 bg-gray-200 w-5/6"></div>
                    <div className="h-5 bg-gray-200 w-1/3 mt-2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-pink-200/50 flex flex-col">
                <Link to={`/blog/${post.slug}`} className="flex flex-col flex-grow">
                  <img src={post.cover_image_url || '/placeholder.svg'} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm font-bold text-pink-500 mb-2">{post.category || 'Geral'}</p>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{post.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 flex-grow">{post.excerpt || 'Leia mais sobre este tópico interessante!'}</p>
                    <div className="flex items-center text-pink-600 font-bold mt-auto">
                      Ler mais <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Card>
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