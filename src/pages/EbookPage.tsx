"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, RefreshCcw } from 'lucide-react';
import { useDynamicContent } from '@/hooks/useDynamicContent';

const EbookPage = () => {
  const { loading: authLoading } = useAuth();

  // Fetch dynamic content for Kiwify links
  const { data: checkoutEbookContent } = useDynamicContent('link_checkout_ebook');
  const { data: updateEbookContent } = useDynamicContent('link_atualizacao_ebook');

  const checkoutLink = checkoutEbookContent?.link_url || "https://kiwify.com.br/checkout-ebook-placeholder";
  const updateLink = updateEbookContent?.link_url || "https://kiwify.com.br/area-membros-ebook-placeholder";

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando página do Ebook...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <BookOpen className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Seu Guia Completo para uma Vida <span className="text-pink-500">Fitness e Saudável</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Descubra os segredos para transformar seu corpo e sua mente com nosso Ebook exclusivo.
          </p>
        </div>

        <Card className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden p-6 md:p-8 lg:p-10 text-center">
          <img
            src="/placeholder.svg" // Placeholder image, replace with actual ebook cover
            alt="Capa do Ebook LumtsFit"
            className="w-full max-w-sm mx-auto h-auto object-cover rounded-lg mb-8 shadow-md"
          />
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Ebook: Receitas e Estratégias para o Corpo dos Seus Sonhos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              Este ebook é o seu passaporte para uma alimentação deliciosa e resultados duradouros.
              Com receitas exclusivas, dicas de nutrição e um plano passo a passo, você vai alcançar
              seus objetivos de forma prazerosa e sustentável.
            </p>
            <ul className="list-disc list-inside text-left text-slate-600 space-y-2 mb-6 max-w-md mx-auto">
              <li>Mais de 50 receitas saudáveis e saborosas</li>
              <li>Estratégias de planejamento alimentar</li>
              <li>Dicas para acelerar seu metabolismo</li>
              <li>Guia de suplementação inteligente</li>
              <li>Bônus exclusivos para membros</li>
            </ul>

            <div className="space-y-4">
              <Button asChild className="w-full btn-calculate bg-pink-500 hover:bg-pink-600">
                <a href={checkoutLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 mr-2" /> QUERO MEU EBOOK AGORA!
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full border-pink-500 text-pink-500 hover:bg-pink-50">
                <a href={updateLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  <RefreshCcw className="h-5 w-5 mr-2" /> Já comprei, baixar atualização
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookPage;