"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number; // thickness of the circle
  circleColorClass?: string; // Tailwind class for the background circle color, e.g., 'text-gray-200'
  indicatorColorClass?: string; // Tailwind class for the progress indicator color, e.g., 'text-pink-500'
  children?: React.ReactNode;
}

const CircularProgress = ({
  progress,
  size = 100,
  strokeWidth = 10,
  circleColorClass = 'text-gray-200',
  indicatorColorClass = 'text-pink-500', // Default to a Tailwind text color class
  children,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Extract the color name and shade from the indicatorColorClass
  // e.g., 'text-pink-500' -> 'pink-500'
  const indicatorColorVar = indicatorColorClass.split('-').slice(1).join('-'); // 'pink-500'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar" // ARIA role
        aria-valuenow={Math.round(progress)} // Current value, rounded
        aria-valuemin={0} // Minimum value
        aria-valuemax={100} // Maximum value
      >
        <circle
          className={cn(circleColorClass)}
          stroke="currentColor" // Use currentColor to pick up the text color from circleColorClass
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-500 ease-in-out")}
          stroke={`hsl(var(--${indicatorColorVar}))`} // Use CSS variable for dynamic color
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute">
        {children}
      </div>
    </div>
  );
};

export default CircularProgress;