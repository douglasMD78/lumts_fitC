"use client";

import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Política de Privacidade</h1>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. Coleta de Informações</h2>
          <p className="text-slate-600 mb-4">
            Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de perfil, ao se registrar ou usar nossos serviços. Também coletamos dados de uso e interação com o aplicativo.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">2. Uso das Informações</h2>
          <p className="text-slate-600 mb-4">
            Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, personalizar sua experiência, enviar comunicações relevantes e garantir a segurança do aplicativo.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">3. Compartilhamento de Informações</h2>
          <p className="text-slate-600 mb-4">
            Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para a prestação de serviços (ex: provedores de hospedagem), por exigência legal ou com seu consentimento explícito.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">4. Segurança dos Dados</h2>
          <p className="text-slate-600 mb-4">
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">5. Seus Direitos</h2>
          <p className="text-slate-600">
            Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Entre em contato conosco para exercer esses direitos.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;