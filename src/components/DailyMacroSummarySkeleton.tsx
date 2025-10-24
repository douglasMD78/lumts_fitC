"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame } from 'lucide-react';

const DailyMacroSummarySkeleton = () => {
  return (
    <Card className="p-6 shadow-lg border-pink-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
          <Flame className="h-7 w-7 mr-3 text-pink-500" /> Resumo Diário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Flame className="h-5 w-5 mr-2 text-pink-500" />
              <span className="font-medium text-slate-700">Calorias</span>
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-3 w-full" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMacroSummarySkeleton;