"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768; // Define o breakpoint para mobile (ex: tablets para baixo)

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT); // Define o estado inicial
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile; // Retorna true se for mobile, false caso contrário
}