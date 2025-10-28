import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import MacroCalculatorPage from "./pages/MacroCalculatorPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import EbookPage from "./pages/EbookPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import ChallengesPage from "./pages/ChallengesPage";
import ProposeChallengePage from "./pages/ProposeChallengePage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiesPolicyPage from "./pages/CookiesPolicyPage";
import OverviewPage from "./pages/OverviewPage";
import MySpacePage from "./pages/MySpacePage";
import MyMacroPlansPage from "./pages/MyMacroPlansPage";
import CycleTrackerGatePage from "./pages/CycleTrackerGatePage";
import CycleTrackerConfigPage from "./pages/CycleTrackerConfigPage";
import CycleTrackerDisplayPage from "./pages/CycleTrackerDisplayPage";
import WaterIntakeCalculatorPage from "./pages/WaterIntakeCalculatorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import SupplementRecommenderPage from "./pages/SupplementRecommenderPage";
import RoutineTrackerPage from "./pages/RoutineTrackerPage";
import MyGoalsPage from "./pages/MyGoalsPage";
import ProgressPage from "./pages/ProgressPage";

// Lazy-loaded Hub Components
const LazyRoutineTrackerPage = lazy(() => import('./pages/RoutineTrackerPage'));
const LazyMyGoalsPage = lazy(() => import('./pages/MyGoalsPage'));
const LazyCommunityPage = lazy(() => import('./pages/CommunityPage')); // Using CommunityPage for /explore

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/calculadora-macros" element={<MacroCalculatorPage />} />
      <Route path="/calculadora-agua" element={<WaterIntakeCalculatorPage />} />
      <Route path="/recomendador-suplementos" element={<SupplementRecommenderPage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/ebook" element={<EbookPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/contato" element={<ContactPage />} />
      <Route path="/comunidade" element={<CommunityPage />} />
      <Route path="/desafios" element={<ChallengesPage />} />
      <Route path="/termos" element={<TermsPage />} />
      <Route path="/privacidade" element={<PrivacyPolicyPage />} />
      <Route path="/cookies" element={<CookiesPolicyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      
      <Route path="/rastreador-ciclo" element={<CycleTrackerGatePage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/meu-espaco" element={<MySpacePage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/meus-planos" element={<MyMacroPlansPage />} />
        <Route path="/progresso" element={<ProgressPage />} />
        <Route path="/propor-desafio" element={<ProposeChallengePage />} />
        
        <Route path="/rastreador-ciclo/configurar" element={<CycleTrackerConfigPage />} />
        <Route path="/rastreador-ciclo/hoje" element={<CycleTrackerDisplayPage />} />

        {/* Hub Routes with Lazy Loading */}
        <Route path="/rastreador-rotina" element={<Suspense fallback={<div>Carregando Rotina...</div>}><LazyRoutineTrackerPage /></Suspense>} />
        <Route path="/minhas-metas" element={<Suspense fallback={<div>Carregando Metas...</div>}><LazyMyGoalsPage /></Suspense>} />
        <Route path="/explore" element={<Suspense fallback={<div>Carregando Explorar...</div>}><LazyCommunityPage /></Suspense>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;