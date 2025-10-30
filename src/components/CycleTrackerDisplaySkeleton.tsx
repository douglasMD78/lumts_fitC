"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplet } from 'lucide-react';

const CycleTrackerDisplaySkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Main Cycle Card Skeleton */}
        <Card className="p-6 text-center shadow-lg border-pink-100">
          <CardHeader className="flex flex-row items-center justify-center relative pb-4">
            <Droplet className="h-8 w-8 mr-3 text-pink-300" />
            <CardTitle className="text-2xl font-bold text-slate-800">
              <Skeleton className="h-8 w-48" />
            </CardTitle>
            <Skeleton className="absolute top-0 right-0 h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Skeleton className="h-[220px] w-[220px] rounded-full mb-4" />
            <Skeleton className="h-6 w-64" />
          </CardContent>
        </Card>

        {/* Info Accordion Skeleton */}
        <Card className="p-6 shadow-lg border-pink-100">
          <Skeleton className="h-6 w-full mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </Card>

        {/* Buttons Skeleton */}
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="w-full h-14 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="w-full h-14 rounded-2xl" />
            <Skeleton className="w-full h-14 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTrackerDisplaySkeleton;