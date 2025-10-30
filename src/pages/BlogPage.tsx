"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import BlogCard from '@/components/BlogCard';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';
import { BookOpen } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

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
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const BlogPage = () => {
  const { data: blogPosts, isLoading, isError, error } = useQuery<BlogPost[], Error, BlogPost[], (string)[]>({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
    // onError: (error: Error) => { // Removido conforme a nova API do TanStack Query v5
    //   showError('Erro ao carregar posts do blog: ' + error.message);
    // },
  });

  if (isError) {
    showError('Erro ao carregar posts do blog: ' + error.message);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Nosso <span className="text-pink-500">Blog LumtsFit</span>
          </h1>
          <p className="text-slate-600">
            Artigos, dicas e inspirações para sua jornada de bem-estar.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={BookOpen}
            title="Erro ao carregar posts"
            description="Não foi possível carregar os posts do blog. Tente novamente mais tarde."
            iconColorClass="text-red-500"
          />
        ) : blogPosts?.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nenhum post disponível"
            description="Volte em breve para novas atualizações!"
            iconColorClass="text-pink-500"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts?.map((post: BlogPost) => (
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
        )}
      </div>
    </div>
  );
};

export default BlogPage;