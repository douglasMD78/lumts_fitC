import { lazy, Suspense } from "react";
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
const LazySuplesDaLuPage = lazy(() => import('./pages/SuplesDaLuPage')); // Renamed

// Protected Lazy-loaded Page Components
const LazyMySpacePage = lazy(() => import('./pages/MySpacePage'));
const LazyProfilePage = lazy(() => import('./pages/ProfilePage'));
const LazyMyMacroPlansPage = lazy(() => import('./pages/MyMacroPlansPage'));
const LazyCycleTrackerConfigPage = lazy(() => import('./pages/CycleTrackerConfigPage'));
const LazyCycleTrackerDisplayPage = lazy(() => import('./pages/CycleTrackerDisplayPage'));
const LazyNotFound = lazy(() => import('./pages/NotFound'));


const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} /> {/* HomePage não é lazy-loaded */}
      
      <Route path="/calculadora-macros" element={<Suspense fallback={<div>Carregando Calculadora de Macros...</div>}><LazyMacroCalculatorPage /></Suspense>} />
      <Route path="/calculadora-agua" element={<Suspense fallback={<div>Carregando Calculadora de Água...</div>}><LazyWaterIntakeCalculatorPage /></Suspense>} />
      <Route path="/calculadora-bf" element={<Suspense fallback={<div>Carregando Calculadora de BF%...</div>}><LazyBodyFatCalculatorPage /></Suspense>} />
      <Route path="/suples-da-lu" element={<Suspense fallback={<div>Carregando Suples da Lu...</div>}><LazySuplesDaLuPage /></Suspense>} /> {/* Updated route */}
      <Route path="/sobre" element={<Suspense fallback={<div>Carregando Sobre Mim...</div>}><LazyAboutPage /></Suspense>} />
      <Route path="/ebook" element={<Suspense fallback={<div>Carregando Ebook...</div>}><LazyEbookPage /></Suspense>} />
      <Route path="/blog" element={<Suspense fallback={<div>Carregando Blog...</div>}><LazyBlogPage /></Suspense>} />
      <Route path="/blog/:slug" element={<Suspense fallback={<div>Carregando Post do Blog...</div>}><LazyBlogPostPage /></Suspense>} />
      <Route path="/contato" element={<Suspense fallback={<div>Carregando Contato...</div>}><LazyContactPage /></Suspense>} />
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
        <Route path="/perfil" element={<Suspense fallback={<div>Carregando Perfil...</div>}><LazyProfilePage /></Suspense>} />
        <Route path="/meus-planos" element={<Suspense fallback={<div>Carregando Meus Planos de Macros...</div>}><LazyMyMacroPlansPage /></Suspense>} />
        
        <Route path="/rastreador-ciclo/configurar" element={<Suspense fallback={<div>Carregando Configuração do Ciclo...</div>}><LazyCycleTrackerConfigPage /></Suspense>} />
        <Route path="/rastreador-ciclo/hoje" element={<Suspense fallback={<div>Carregando Status do Ciclo...</div>}><LazyCycleTrackerDisplayPage /></Suspense>} />
      </Route>

      <Route path="*" element={<Suspense fallback={<div>Carregando Página Não Encontrada...</div>}><LazyNotFound /></Suspense>} />
    </Route>
  </Routes>
);

export default AppRoutes;