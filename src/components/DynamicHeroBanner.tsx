"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDynamicContent } from '@/hooks/useDynamicContent';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface DynamicHeroBannerProps {
  slug: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultLink: string;
  defaultImage?: string;
  buttonText: string;
}

const DynamicHeroBanner = ({
  slug,
  defaultTitle,
  defaultDescription,
  defaultLink,
  defaultImage = '/placeholder.svg',
  buttonText,
}: DynamicHeroBannerProps) => {
  const { data: content, isLoading } = useDynamicContent(slug);

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-lg border border-pink-100 overflow-hidden h-64 animate-pulse bg-gray-200">
        <div className="p-6">
          <div className="h-8 w-3/4 bg-gray-300 mb-4"></div>
          <div className="h-4 w-full bg-gray-300 mb-4"></div>
          <div className="h-12 bg-gray-300 w-full rounded-full"></div>
        </div>
      </Card>
    );
  }

  const title = content?.title || defaultTitle;
  const description = content?.subtitle || defaultDescription;
  const image = content?.image_url || defaultImage;
  const link = content?.link_url || defaultLink;

  if (!content?.is_active && content !== null) {
    return null; // Don't render if content is explicitly inactive
  }

  const isExternalLink = link.startsWith('http');

  return (
    <Link to={isExternalLink ? '#' : link} onClick={() => { if (isExternalLink) window.open(link, '_blank'); }} className="block">
      <Card className="relative rounded-2xl shadow-lg border border-pink-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/50 hover:-translate-y-1">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300"></div>
        <div className="relative p-6 md:p-8 lg:p-10 text-white text-center flex flex-col justify-center items-center min-h-[250px]">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-white/90 max-w-2xl mx-auto">{description}</p>
            <Button asChild variant="secondary" className="bg-white text-pink-500 hover:bg-gray-100 font-bold rounded-full px-8 py-4 h-auto text-lg shadow-lg">
              {isExternalLink ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  {buttonText} <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              ) : (
                <Link to={link} className="flex items-center justify-center">
                  {buttonText} <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </Button>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default DynamicHeroBanner;