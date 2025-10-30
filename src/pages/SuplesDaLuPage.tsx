"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ExternalLink, HeartHandshake } from 'lucide-react'; // Added HeartHandshake

interface ProductRecommendation {
  name: string;
  description: string;
  benefits: string[];
  image: string; // Added image field
  link: string;
}

const products: ProductRecommendation[] = [
  {
    name: "Whey Protein Isolado (Growth Supplements)",
    description: "Otimize sua recuperação e ganho de massa muscular com o whey protein de alta qualidade que eu uso e confio!",
    benefits: ["Recuperação rápida", "Alto teor proteico", "Baixo carboidrato"],
    image: "/placeholder.svg", // Placeholder image
    link: "https://www.gsuplementos.com.br/whey-protein-isolado-growth-supplements-p985900" // Affiliate link
  },
  {
    name: "Creatina Monohidratada (Growth Supplements)",
    description: "Aumente sua força, potência e desempenho nos treinos. Essencial para quem busca resultados sérios!",
    benefits: ["Aumento de força", "Melhora de performance", "Volume muscular"],
    image: "/placeholder.svg", // Placeholder image
    link: "https://www.gsuplementos.com.br/creatina-monohidratada-growth-supplements-p985901" // Affiliate link
  },
  {
    name: "Pré-treino Évora PW (Growth Supplements)",
    description: "Tenha mais energia, foco e resistência para treinos intensos. Sinta a diferença em cada repetição!",
    benefits: ["Mais energia", "Foco mental", "Resistência"],
    image: "/placeholder.svg", // Placeholder image
    link: "https://www.gsuplementos.com.br/pre-treino-evora-pw-growth-supplements-p985902" // Affiliate link
  },
  {
    name: "Ômega 3 (Growth Supplements)",
    description: "Cuide da sua saúde cardiovascular, cerebral e reduza inflamações com este suplemento fundamental.",
    benefits: ["Saúde do coração", "Função cerebral", "Anti-inflamatório"],
    image: "/placeholder.svg", // Placeholder image
    link: "https://www.gsuplementos.com.br/omega-3-growth-supplements-p985903" // Affiliate link
  },
];

const SuplesDaLuPage = () => {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <HeartHandshake className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Suples da Lu</h2>
          <p className="text-pink-600 text-base">Os suplementos que eu uso e recomendo para você!</p>
        </div>

        <div className="space-y-6">
          <Card className="main-result-card bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-fuchsia-500/30">
            <CardHeader className="text-center">
              <Sparkles className="h-12 w-12 mx-auto text-white mb-3" />
              <CardTitle className="text-2xl font-bold text-white">Minhas Escolhas para Você!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-white/90">
                Com anos de experiência, selecionei os melhores suplementos para te ajudar a alcançar seus objetivos.
              </p>
            </CardContent>
          </Card>

          {products.map((product, index) => (
            <Card key={index} className="p-4 shadow-lg border-pink-100">
              <CardHeader className="pb-2">
                <img src={product.image} alt={product.name} className="w-full h-32 object-contain mb-4 rounded-md" />
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-600">{product.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.benefits.map((benefit, bIndex) => (
                    <span key={bIndex} className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4 border-pink-500 text-pink-500 hover:bg-pink-50">
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Comprar na Growth <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuplesDaLuPage;