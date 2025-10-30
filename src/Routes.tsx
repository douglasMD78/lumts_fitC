import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage"; // Importar HomePage diretamente, não lazy

// Lazy-loaded Page Components
const LazyAboutPage = lazy(() => import('./pages/AboutPage'));
const LazyEbookPage = lazy(() => import('./pages/EbookPage'));
const LazyBlogPage = lazy(() => import('./pages/BlogPage'));
const LazyBlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const LazyContactPage = lazy(() => import('./pages/ContactPage'));
const LazyCommunityPage = lazy(() => import('./pages/CommunityPage'));
const LazyChallengesPage = lazy(() => import('./pages/ChallengesPage'));
const LazyTermsPage = lazy(() => import('./pages/TermsPage'));
const LazyPrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const LazyCookiesPolicyPage = lazy(() => import('./pages/CookiesPolicyPage'));
const LazyLoginPage = lazy(() => import('./pages/LoginPage'));
const LazySignUpPage = lazy(() => import('./pages/SignUpPage'));
const LazyForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const LazyUpdatePasswordPage = lazy(() => import('./pages/UpdatePasswordPage'));
const LazyCycleTrackerGatePage = lazy(() => import('./pages/CycleTrackerGatePage'));
const LazyMacroCalculatorPage = lazy(() => import('./pages/MacroCalculatorPage'));
const LazyWaterIntakeCalculatorPage = lazy(() => import('./pages/WaterIntakeCalculatorPage'));
const LazyBodyFatCalculatorPage = lazy(() => import('./pages/BodyFatCalculatorPage'));
const LazySupplementRecommenderPage = lazy(() => import('./pages/SupplementRecommenderPage'));

// Protected Lazy-loaded Page Components
const LazyMySpacePage = lazy(() => import('./pages/MySpacePage'));
const LazyOverviewPage = lazy(() => import('./pages/OverviewPage'));
const LazyProfilePage = lazy(() => import('./pages/ProfilePage'));
const LazyMyMacroPlansPage = lazy(() => import('./pages/MyMacroPlansPage'));
const LazyProgressPage = lazy(() => import('./pages/ProgressPage'));
const LazyProposeChallengePage = lazy(() => import('./pages/ProposeChallengePage'));
const LazyCycleTrackerConfigPage = lazy(() => import('./pages/CycleTrackerConfigPage'));
const LazyCycleTrackerDisplayPage = lazy(() => import('./pages/CycleTrackerDisplayPage'));
const LazyRoutineTrackerPage = lazy(() => import('./pages/RoutineTrackerPage'));
const LazyMyGoalsPage = lazy(() => import('./pages/MyGoalsPage'));
const LazyNotFound = lazy(() => import('./pages/NotFound'));


const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} /> {/* HomePage não é lazy-loaded */}
      
      <Route path="/calculadora-macros" element={<Suspense fallback={<div>Carregando Calculadora de Macros...</div>}><LazyMacroCalculatorPage /></Suspense>} />
      <Route path="/calculadora-agua" element={<Suspense fallback={<div>Carregando Calculadora de Água...</div>}><LazyWaterIntakeCalculatorPage /></Suspense>} />
      <Route path="/calculadora-bf" element={<Suspense fallback={<div>Carregando Calculadora de BF%...</div>}><LazyBodyFatCalculatorPage /></Suspense>} />
      <Route path="/recomendador-suplementos" element={<Suspense fallback={<div>Carregando Recomendador de Suplementos...</div>}><LazySupplementRecommenderPage /></Suspense>} />
      <Route path="/sobre" element={<Suspense fallback={<div>Carregando Sobre Mim...</div>}><LazyAboutPage /></Suspense>} />
      <Route path="/ebook" element={<Suspense fallback={<div>Carregando Ebook...</div>}><LazyEbookPage /></Suspense>} />
      <Route path="/blog" element={<Suspense fallback={<div>Carregando Blog...</div>}><LazyBlogPage /></Suspense>} />
      <Route path="/blog/:slug" element={<Suspense fallback={<div>Carregando Post do Blog...</div>}><LazyBlogPostPage /></Suspense>} />
      <Route path="/contato" element={<Suspense fallback={<div>Carregando Contato...</div>}><LazyContactPage /></Suspense>} />
      <Route path="/comunidade" element={<Suspense fallback={<div>Carregando Comunidade...</div>}><LazyCommunityPage /></Suspense>} />
      <Route path="/desafios" element={<Suspense fallback={<div>Carregando Desafios...</div>}><LazyChallengesPage /></Suspense>} />
      <Route path="/termos" element={<Suspense fallback={<div>Carregando Termos de Uso...</div>}><LazyTermsPage /></Suspense>} />
      <Route path="/privacidade" element={<Suspense fallback={<div>Carregando Política de Privacidade...</div>}><LazyPrivacyPolicyPage /></Suspense>} />
      <Route path="/cookies" element={<Suspense fallback={<div>Carregando Política de Cookies...</div>}><LazyCookiesPolicyPage /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<div>Carregando Login...</div>}><LazyLoginPage /></Suspense>} />
      <Route path="/signup" element={<Suspense fallback={<div>Carregando Cadastro...</div>}><LazySignUpPage /></Suspense>} />
      <Route path="/forgot-password" element={<Suspense fallback={<div>Carregando Recuperação de Senha...</div>}><LazyForgotPasswordPage /></Suspense>} />
      <Route path="/update-password" element={<Suspense fallback={<div>Carregando Atualização de Senha...</div>}><LazyUpdatePasswordPage /></Suspense>} />
      
      <Route path="/rastreador-ciclo" element={<Suspense fallback={<div>Carregando Rastreador de Ciclo...</div>}><LazyCycleTrackerGatePage /></Suspense>} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/meu-espaco" element={<Suspense fallback={<div>Carregando Meu Espaço...</div>}><LazyMySpacePage /></Suspense>} />
        <Route path="/overview" element={<Suspense fallback={<div>Carregando Visão Geral...</div>}><LazyOverviewPage /></Suspense>} />
        <Route path="/perfil" element={<Suspense fallback={<div>Carregando Perfil...</div>}><LazyProfilePage /></Suspense>} />
        <Route path="/meus-planos" element={<Suspense fallback={<div>Carregando Meus Planos de Macros...</div>}><LazyMyMacroPlansPage /></Suspense>} />
        <Route path="/progresso" element={<Suspense fallback={<div>Carregando Progresso...</div>}><LazyProgressPage /></Suspense>} />
        <Route path="/propor-desafio" element={<Suspense fallback={<div>Carregando Propor Desafio...</div>}><LazyProposeChallengePage /></Suspense>} />
        
        <Route path="/rastreador-ciclo/configurar" element={<Suspense fallback={<div>Carregando Configuração do Ciclo...</div>}><LazyCycleTrackerConfigPage /></Suspense>} />
        <Route path="/rastreador-ciclo/hoje" element={<Suspense fallback={<div>Carregando Status do Ciclo...</div>}><LazyCycleTrackerDisplayPage /></Suspense>} />

        {/* Hub Routes with Lazy Loading */}
        <Route path="/rastreador-rotina" element={<Suspense fallback={<div>Carregando Rotina...</div>}><LazyRoutineTrackerPage /></Suspense>} />
        <Route path="/minhas-metas" element={<Suspense fallback={<div>Carregando Metas...</div>}><LazyMyGoalsPage /></Suspense>} />
        <Route path="/explore" element={<Suspense fallback={<div>Carregando Explorar...</div>}><LazyCommunityPage /></Suspense>} />
      </Route>

      <Route path="*" element={<Suspense fallback={<div>Carregando Página Não Encontrada...</div>}><LazyNotFound /></Suspense>} />
    </Route>
  </Routes>
);

export default AppRoutes;