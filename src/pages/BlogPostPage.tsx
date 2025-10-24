"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  content: string;
  cover_image_url: string | null;
  created_at: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogPost = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      setPost(data || null);
    } catch (error: any) {
      showError('Erro ao carregar o post do blog: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlogPost();
  }, [fetchBlogPost]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Post não encontrado</h1>
        <p className="text-lg text-slate-600 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
        <Button asChild className="bg-pink-500 hover:bg-pink-600">
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para o Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
        {post.cover_image_url && (
          <img 
            src={post.cover_image_url} 
            alt={post.title} 
            className="w-full h-64 object-cover" 
          />
        )}
        <div className="p-6 md:p-8 lg:p-10">
          <p className="text-sm font-bold text-pink-500 mb-2">{post.category || 'Geral'}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{post.title}</h1>
          <p className="text-slate-500 text-sm mb-6">Publicado em: {new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
          
          <div 
            className="prose prose-pink max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-10 pt-6 border-t border-pink-100">
            <Button asChild variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para o Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;