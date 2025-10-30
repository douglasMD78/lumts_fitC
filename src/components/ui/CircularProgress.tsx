"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string; // Para a cor do indicador
}

const CircularProgress = ({
  progress,
  size = 100,
  strokeWidth = 10,
  children,
  className,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      {/* Background circle */}
      <circle
        stroke="#e5e7eb" // gray-200
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress indicator circle */}
      <circle
        stroke="currentColor" // Usar currentColor
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        className={cn("transition-all duration-700 ease-out", className)} // Aplicar className aqui
      />
      {/* Text/Children */}
      <g className="transform rotate-90" transform={`rotate(90 ${size / 2} ${size / 2})`}>
        {children}
      </g>
    </svg>
  );
};

export default CircularProgress;