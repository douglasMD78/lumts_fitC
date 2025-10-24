import { Skeleton } from "@/components/ui/skeleton";

const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-2">
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  </div>
);

export default BlogCardSkeleton;