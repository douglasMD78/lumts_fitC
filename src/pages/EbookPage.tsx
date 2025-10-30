"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Lock } from 'lucide-react';
import LoginGate from '@/components/LoginGate';
import EmptyState from '@/components/EmptyState';

// Importar o novo hook
import { useEbooks } from '@/hooks/useEbooks';

interface Ebook {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  download_url: string;
}

const EbookPage = () => {
  const { user, loading: authLoading } = useAuth();

  // Usar o hook de query para buscar ebooks
  const { data: ebooks, isLoading: loadingEbooks } = useEbooks();

  // Removido useEffect para tratamento de erro, agora gerenciado pelo hook useEbooks
  // useEffect(() => {
  //   if (fetchError) {
  //     showError('Erro ao carregar ebooks: ' + fetchError.message);
  //   }
  // }, [fetchError]);

  if (authLoading || loadingEbooks) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando ebooks...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <EmptyState
          icon={Lock}
          title="Conteúdo Exclusivo para Membros"
          description="Faça login ou crie sua conta para acessar ebooks, receitas e guias exclusivos."
          buttonText="Fazer Login"
          onClick={() => { /* navigate to login */ }} // Adicionado onClick para o EmptyState
          iconColorClass="text-pink-500"
          buttonVariant="default"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Seus <span className="text-pink-500">Ebooks Exclusivos</span>
          </h1>
          <p className="text-slate-600">
            Conteúdo premium para impulsionar sua jornada fitness.
          </p>
        </div>

        {ebooks && ebooks.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nenhum ebook disponível"
            description="Volte em breve para novas atualizações!"
            iconColorClass="text-pink-500"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks && ebooks.map((ebook) => (
              <Card key={ebook.id} className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
                {ebook.cover_image_url && (
                  <img
                    src={ebook.cover_image_url}
                    alt={ebook.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">{ebook.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ebook.description && (
                    <p className="text-slate-600 text-sm">{ebook.description}</p>
                  )}
                  <Button asChild className="w-full bg-pink-500 hover:bg-pink-600">
                    <a href={ebook.download_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Download className="h-5 w-5 mr-2" /> Acessar Ebook
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookPage;