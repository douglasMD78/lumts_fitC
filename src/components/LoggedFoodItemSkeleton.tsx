"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoggedFoodItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
      <div>
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  );
};

export default LoggedFoodItemSkeleton;