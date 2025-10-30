"use client";

import { useState, useEffect } from 'react';
import { Calendar, Trophy, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/EmptyState';

import { useDynamicContent } from '@/hooks/useDynamicContent'; // Import useDynamicContent

const ChallengesPage = () => {
  // Fetch dynamic content for the active challenge
  const { data: activeChallengeContent, isLoading: loadingChallengeContent } = useDynamicContent('desafio_ativo');

  // Use dynamic content or fallbacks
  const challengeTitle = activeChallengeContent?.title || "Desafio Ativo LumtsFit";
  const challengeDescription = activeChallengeContent?.subtitle || "Participe do nosso desafio exclusivo e transforme seu corpo!";
  const challengeImage = activeChallengeContent?.image_url || "/placeholder.svg";
  const challengeLink = activeChallengeContent?.link_url || "https://linktr.ee/lumtsfit_desafio_placeholder";
  // For duration, difficulty, participants, rewards, we might need to parse subtitle or add more fields to dynamic_content
  // For now, using static placeholders if not available in dynamic_content
  const challengeDuration = "21 Dias";
  const challengeDifficulty = "Moderado";
  const challengeParticipants = "1200+";
  const challengeRewards = "Acesso a treinos exclusivos e guia alimentar";

  if (loadingChallengeContent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando desafio...</p>
      </div>
    );
  }

  if (!activeChallengeContent) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <EmptyState
          icon={Trophy}
          title="Nenhum desafio ativo no momento"
          description="Volte em breve para novos desafios emocionantes!"
          iconColorClass="text-pink-500"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Desafios <span className="text-pink-500">LumtsFit</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Participe do nosso desafio ativo e transforme seu corpo!
          </p>
        </div>

        <Card className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 flex flex-col items-center text-center">
          {challengeImage && (
            <img src={challengeImage} alt={challengeTitle} className="w-full max-w-md h-auto object-cover rounded-lg mb-6 shadow-md" />
          )}
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{challengeTitle}</h2>
          <p className="text-slate-600 mb-6 max-w-xl">{challengeDescription}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-6">
            <div className="flex items-center justify-center text-sm text-slate-500 bg-pink-50 p-3 rounded-lg">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Duração: {challengeDuration}</span>
            </div>
            <div className="flex items-center justify-center text-sm text-slate-500 bg-pink-50 p-3 rounded-lg">
              <Trophy className="h-4 w-4 mr-2" />
              <span>Dificuldade: {challengeDifficulty}</span>
            </div>
            <div className="flex items-center justify-center text-sm text-slate-500 bg-pink-50 p-3 rounded-lg col-span-full">
              <Users className="h-4 w-4 mr-2" />
              <span>{challengeParticipants} participantes</span>
            </div>
          </div>

          <Button asChild className="btn-calculate w-full max-w-md bg-pink-500 hover:bg-pink-600">
            <a href={challengeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              QUERO PARTICIPAR! <ExternalLink className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </Card>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mt-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Não perca os próximos desafios!</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Fique ligada em nossas redes sociais e no blog para ser a primeira a saber sobre novos desafios e conteúdos exclusivos.
          </p>
          <Button asChild variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
            <Link to="/blog">Visitar Blog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;