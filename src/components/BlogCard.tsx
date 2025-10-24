import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  slug: string;
}

const BlogCard = ({ image, category, title, excerpt, slug }: BlogCardProps) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-pink-200/50 flex flex-col">
    <Link to={`/blog/${slug}`} className="flex flex-col flex-grow">
      <img src={image} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm font-bold text-pink-500 mb-2">{category}</p>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 text-sm mb-4 flex-grow">{excerpt}</p>
        <div className="flex items-center text-pink-600 font-bold mt-auto">
          Ler mais <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  </div>
);

export default BlogCard;