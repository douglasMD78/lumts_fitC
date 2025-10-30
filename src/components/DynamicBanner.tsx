"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDynamicContent } from '@/hooks/useDynamicContent';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react'; // Ensure ExternalLink is imported

interface DynamicBannerProps {
  slug: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultLink: string;
  defaultImage?: string;
  buttonText: string;
  variant?: 'default' | 'hero';
  colorClass?: string;
}

const DynamicBanner = ({
  slug,
  defaultTitle,
  defaultDescription,
  defaultLink,
  defaultImage = '/placeholder.svg',
  buttonText,
  variant = 'default',
  colorClass = 'bg-white text-slate-800',
}: DynamicBannerProps) => {
  const { data: content, isLoading } = useDynamicContent(slug);
  const isHero = variant === 'hero';

  if (isLoading) {
    return (
      <Card className={cn(
        "rounded-2xl shadow-lg border border-pink-100 overflow-hidden",
        isHero ? "col-span-full md:col-span-2 lg:col-span-3" : "",
        colorClass.includes('bg-') ? colorClass : `bg-white ${colorClass}`
      )}>
        <div className="animate-pulse p-6">
          <div className="h-48 w-full bg-gray-200 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-200 w-3/4 mx-auto mb-3"></div>
          <div className="h-4 bg-gray-200 w-full mb-4"></div>
          <div className="h-12 bg-gray-200 w-full rounded-full"></div>
        </div>
      </Card>
    );
  }

  const title = content?.title || defaultTitle; // Added optional chaining
  const description = content?.subtitle || defaultDescription; // Added optional chaining
  const image = content?.image_url || defaultImage; // Added optional chaining
  const link = content?.link_url || defaultLink; // Added optional chaining

  if (!content?.is_active && content !== null) {
    return null; // Don't render if content is explicitly inactive
  }

  return (
    <Card className={cn(
      "rounded-2xl shadow-lg border border-pink-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/50 hover:-translate-y-1",
      isHero ? "col-span-full md:col-span-2 lg:col-span-3" : "",
      colorClass.includes('bg-') ? colorClass : `bg-white ${colorClass}`
    )}>
      {image && (
        <img src={image} alt={title} className={cn(
          "w-full object-cover",
          isHero ? "h-64 md:h-80" : "h-48"
        )} />
      )}
      <CardHeader className={cn(
        "pb-4",
        isHero ? "text-center" : ""
      )}>
        {isHero && (
          <div className="mb-3 mx-auto">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
        )}
        <CardTitle className={cn(
          "text-xl font-bold",
          isHero ? "text-3xl md:text-4xl text-white" : "text-slate-800"
        )}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "space-y-4",
        isHero ? "text-center text-white/90" : "text-slate-600"
      )}>
        <p className={cn(
          isHero ? "text-lg" : "text-sm"
        )}>{description}</p>
        <Button asChild 
          className={cn(
            "w-full",
            isHero ? "bg-white text-pink-500 hover:bg-gray-100 font-bold rounded-full px-8 py-4 h-auto shadow-lg" : "bg-pink-500 hover:bg-pink-600"
          )}
        >
          {link.startsWith('/') ? (
            <Link to={link} className="flex items-center justify-center">
              {buttonText} {link.startsWith('http') ? <ExternalLink className="h-4 w-4 ml-2" /> : <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Link>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              {buttonText} <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DynamicBanner;