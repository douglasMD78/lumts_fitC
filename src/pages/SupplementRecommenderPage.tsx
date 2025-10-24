"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Dumbbell, Zap, Heart, RefreshCcw, ExternalLink } from 'lucide-react';
import { showError } from '@/utils/toast';

const supplementSchema = z.object({
  goal: z.enum([
    'muscle_gain',
    'weight_loss',
    'energy_performance',
    'recovery',
    'general_health'
  ], { message: "Selecione seu objetivo principal" }),
});

type SupplementFormInputs = z.infer<typeof supplementSchema>;

interface SupplementRecommendation {
  name: string;
  description: string;
  benefits: string[];
  link: string;
}

const recommendations: Record<SupplementFormInputs['goal'], SupplementRecommendation[]> = {
  muscle_gain: [
    {
      name: "Whey Protein",
      description: "Essencial para a recuperação e construção muscular, fornecendo aminoácidos rapidamente.",
      benefits: ["Recuperação muscular", "Síntese proteica", "Saciedade"],
      link: "https://www.gsuplementos.com.br/whey-protein-c100"
    },
    {
      name: "Creatina",
      description: "Aumenta a força, potência e volume muscular, melhorando o desempenho em treinos de alta intensidade.",
      benefits: ["Aumento de força", "Melhora de performance", "Volume muscular"],
      link: "https://www.gsuplementos.com.br/creatina-c101"
    },
    {
      name: "BCAA",
      description: "Aminoácidos de cadeia ramificada que auxiliam na recuperação e previnem o catabolismo muscular.",
      benefits: ["Recuperação", "Anti-catabólico", "Redução da fadiga"],
      link: "https://www.gsuplementos.com.br/bcaa-c102"
    }
  ],
  weight_loss: [
    {
      name: "Termogênico",
      description: "Ajuda a acelerar o metabolismo e a queima de gordura, aumentando a energia para os treinos.",
      benefits: ["Queima de gordura", "Acelera metabolismo", "Mais energia"],
      link: "https://www.gsuplementos.com.br/termogenicos-c106"
    },
    {
      name: "Whey Protein",
      description: "Contribui para a saciedade e manutenção da massa muscular durante a perda de peso.",
      benefits: ["Saciedade", "Manutenção muscular", "Controle de apetite"],
      link: "https://www.gsuplementos.com.br/whey-protein-c100"
    },
    {
      name: "L-Carnitina",
      description: "Auxilia no transporte de gordura para as células, onde é queimada para gerar energia.",
      benefits: ["Queima de gordura", "Produção de energia", "Melhora da performance"],
      link: "https://www.gsuplementos.com.br/l-carnitina-c107"
    }
  ],
  energy_performance: [
    {
      name: "Pré-treino",
      description: "Formulado para aumentar a energia, foco e resistência durante os exercícios.",
      benefits: ["Mais energia", "Foco mental", "Resistência"],
      link: "https://www.gsuplementos.com.br/pre-treino-c103"
    },
    {
      name: "Creatina",
      description: "Melhora a força e a potência, permitindo treinos mais intensos e eficazes.",
      benefits: ["Aumento de força", "Potência", "Desempenho"],
      link: "https://www.gsuplementos.com.br/creatina-c101"
    },
    {
      name: "Cafeína",
      description: "Estimulante que melhora o estado de alerta, a concentração e reduz a percepção de esforço.",
      benefits: ["Alerta", "Concentração", "Redução da fadiga"],
      link: "https://www.gsuplementos.com.br/cafeina-c108"
    }
  ],
  recovery: [
    {
      name: "Whey Protein",
      description: "Fundamental para a reparação e crescimento muscular pós-treino.",
      benefits: ["Recuperação muscular", "Reparo tecidual", "Redução da dor"],
      link: "https://www.gsuplementos.com.br/whey-protein-c100"
    },
    {
      name: "Glutamina",
      description: "Aminoácido que auxilia na recuperação, função imunológica e saúde intestinal.",
      benefits: ["Imunidade", "Recuperação", "Saúde intestinal"],
      link: "https://www.gsuplementos.com.br/bcaa-c102" // Usando categoria de aminoácidos
    },
    {
      name: "BCAA",
      description: "Ajuda a reduzir a fadiga muscular e a acelerar a recuperação após exercícios intensos.",
      benefits: ["Redução da fadiga", "Recuperação", "Anti-catabólico"],
      link: "https://www.gsuplementos.com.br/bcaa-c102"
    }
  ],
  general_health: [
    {
      name: "Multivitamínico",
      description: "Garante a ingestão adequada de vitaminas e minerais essenciais para o bom funcionamento do corpo.",
      benefits: ["Imunidade", "Bem-estar geral", "Suporte nutricional"],
      link: "https://www.gsuplementos.com.br/vitaminas-e-minerais-c109"
    },
    {
      name: "Ômega 3",
      description: "Ácido graxo essencial com benefícios para a saúde cardiovascular, cerebral e anti-inflamatórios.",
      benefits: ["Saúde cardiovascular", "Função cerebral", "Anti-inflamatório"],
      link: "https://www.gsuplementos.com.br/omega-3-c110"
    },
    {
      name: "Colágeno",
      description: "Contribui para a saúde da pele, cabelos, unhas e articulações.",
      benefits: ["Pele e cabelo", "Articulações", "Elasticidade"],
      link: "https://www.gsuplementos.com.br/colageno-c111"
    }
  ]
};

const SupplementRecommenderPage = () => {
  const [recommendedSupplements, setRecommendedSupplements] = useState<SupplementRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplementFormInputs>({
    resolver: zodResolver(supplementSchema),
    defaultValues: {
      goal: undefined,
    },
  });

  const onSubmit = (data: SupplementFormInputs) => {
    setLoading(true);
    try {
      setRecommendedSupplements(recommendations[data.goal]);
    } catch (error: any) {
      showError("Erro ao gerar recomendações: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setRecommendedSupplements(null);
    reset();
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md card-style p-6 sm:p-8">
        <div className="text-center mb-8">
          <Dumbbell className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold gradient-text mb-3">Recomendador de Suplementos</h2>
          <p className="text-pink-600 text-base">Encontre os suplementos ideais para seus objetivos!</p>
        </div>

        {!recommendedSupplements ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-semibold text-pink-700">Qual seu principal objetivo fitness?</Label>
              <Controller
                name="goal"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.goal ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione seu objetivo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muscle_gain">Ganho de Massa Muscular</SelectItem>
                      <SelectItem value="weight_loss">Emagrecimento</SelectItem>
                      <SelectItem value="energy_performance">Aumento de Energia e Performance</SelectItem>
                      <SelectItem value="recovery">Recuperação Muscular</SelectItem>
                      <SelectItem value="general_health">Saúde Geral e Bem-estar</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal.message}</p>}
            </div>

            <Button type="submit" className="btn-calculate" disabled={loading}>
              {loading ? 'Gerando Recomendações...' : '✨ Ver Recomendações'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card className="main-result-card bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-fuchsia-500/30"> {/* Adjusted shadow */}
              <CardHeader className="text-center">
                <Sparkles className="h-12 w-12 mx-auto text-white mb-3" />
                <CardTitle className="text-2xl font-bold text-white">Suas Recomendações!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-white/90">Com base no seu objetivo, sugerimos:</p>
              </CardContent>
            </Card>

            {recommendedSupplements.map((supplement, index) => (
              <Card key={index} className="p-4 shadow-lg border-pink-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-pink-500" /> {supplement.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-slate-600">{supplement.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {supplement.benefits.map((benefit, bIndex) => (
                      <span key={bIndex} className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4 border-pink-500 text-pink-500 hover:bg-pink-50">
                    <a href={supplement.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      Ver na GSuplementos <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Button className="btn-calculate" onClick={handleRestart}>
              <RefreshCcw className="h-5 w-5 mr-2" /> Fazer Nova Recomendação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplementRecommenderPage;