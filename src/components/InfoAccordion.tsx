"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Zap, Dumbbell, Scale, Cookie } from "lucide-react";

const ICONS: { [key: string]: React.ElementType } = {
  energy: Zap,
  workout: Dumbbell,
  body: Scale,
  cravings: Cookie,
};

interface InfoItem {
  key: string;
  title: string;
  description: string;
}

interface InfoAccordionProps {
  items: InfoItem[];
  colorClass: string;
}

const InfoAccordion = ({ items, colorClass }: InfoAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue={items[0]?.key}>
      {items.map((item) => {
        const Icon = ICONS[item.key];
        return (
          <AccordionItem value={item.key} key={item.key}>
            <AccordionTrigger className="text-lg font-bold text-slate-800 hover:no-underline">
              <div className="flex items-center">
                {Icon && <Icon className={`h-6 w-6 mr-3 ${colorClass}`} />}
                {item.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-slate-600 pl-11">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default InfoAccordion;