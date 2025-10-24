import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HomeFeatureButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  to: string;
  tooltip: string;
}

const HomeFeatureButton = ({ icon, label, to, tooltip }: HomeFeatureButtonProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          onClick={handleNavigate}
          className={cn(
            "group flex flex-col items-center justify-center text-center h-auto p-4 w-full",
            "bg-transparent hover:bg-pink-50/50 rounded-xl transition-all duration-300",
            "cursor-pointer"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="bg-pink-100 rounded-full h-16 w-16 flex items-center justify-center shadow-md group-hover:bg-pink-200 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-300">
              {icon}
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</span>
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default HomeFeatureButton;