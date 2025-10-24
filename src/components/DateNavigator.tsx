"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card'; // Importação adicionada

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigator = ({ selectedDate, onDateChange }: DateNavigatorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <Card className="p-4 flex items-center justify-between shadow-lg border-pink-100">
      <Button variant="ghost" size="icon" onClick={() => onDateChange(subDays(selectedDate, 1))} aria-label="Dia anterior">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-40 justify-center" aria-label={`Data selecionada: ${format(selectedDate, 'dd MMM, yyyy', { locale: ptBR })}`}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, 'dd MMM, yyyy', { locale: ptBR })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) onDateChange(date);
              setIsCalendarOpen(false);
            }}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      <Button variant="ghost" size="icon" onClick={() => onDateChange(addDays(selectedDate, 1))} aria-label="Próximo dia">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </Card>
  );
};

export default DateNavigator;