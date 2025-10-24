"use client";

// Stub para a função de rastreamento de eventos de analytics.
// Em uma implementação real, esta função enviaria dados para um serviço de analytics (ex: Google Analytics, Mixpanel).
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${eventName}`, properties);
  // Implementação real:
  // if (window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }
  // ou
  // if (window.mixpanel) {
  //   window.mixpanel.track(eventName, properties);
  // }
};