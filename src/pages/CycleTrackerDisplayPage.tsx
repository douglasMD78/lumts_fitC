"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, CalendarDays, Edit, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { getCycleDayInfo, getPredictedDates, CyclePhaseInfo, PHASE_CONTENT } from "@/utils/cycleCalculations"; // Import PHASE_CONTENT
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, addDays, isSameDay, parseISO, isFuture } from "date-fns"; // Importar isFuture
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import CircularProgress from "@/components/ui/CircularProgress";
import InfoAccordion from "@/components/InfoAccordion";
import DailyLogForm from "@/components/DailyLogForm";
import CycleTrackerDisplaySkeleton from "@/components/CycleTrackerDisplaySkeleton"; // Importar o skeleton

// Importar os novos hooks
import { useLatestMenstrualCycle } from '@/hooks/useLatestMenstrualCycle';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSaveDailyCycleEntry } from '@/hooks/useSaveDailyCycleEntry';
import { useUpdateMenstrualCycleStartDate } from '@/hooks/useUpdateMenstrualCycleStartDate';
import { useDailyCycleEntriesForUser, DailyEntry } from '@/hooks/useDailyCycleEntriesForUser'; // Importar o novo hook e a interface DailyEntry


interface CycleData {
  id: string;
  lastPeriodStartDate: Date;
  cycleLength: number;
  menstrualLength: number;
}

const CycleTrackerDisplayPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [cycleDayInfo, setCycleDayInfo] = useState<CyclePhaseInfo | null>(null);
  const [predictedDates, setPredictedDates] = useState<ReturnType<typeof getPredictedDates> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isUpdatePeriodOpen, setIsUpdatePeriodOpen] = useState(false);
  const [newPeriodDate, setNewPeriodDate] = useState<Date | undefined>(new Date());

  // Usar os novos hooks
  const { data: latestMenstrualCycle, isLoading: loadingMenstrualCycle, error: menstrualCycleError, refetch: refetchLatestMenstrualCycle } = useLatestMenstrualCycle();
  const { data: dailyEntries, isLoading: loadingDailyEntries, error: dailyEntriesError, refetch: refetchDailyEntries } = useDailyCycleEntriesForUser(); // Usar o novo hook

  const saveDailyEntryMutation = useSaveDailyCycleEntry();
  const updateMenstrualCycleStartDateMutation = useUpdateMenstrualCycleStartDate();

  useEffect(() => {
    if (menstrualCycleError) showError("Erro ao carregar dados do ciclo: " + menstrualCycleError.message);
    if (dailyEntriesError) showError('Erro ao carregar registros diários: ' + dailyEntriesError.message);
  }, [menstrualCycleError, dailyEntriesError]);

  useEffect(() => {
    if (latestMenstrualCycle) {
      const parsedData = {
        id: latestMenstrualCycle.id,
        lastPeriodStartDate: latestMenstrualCycle.start_date,
        cycleLength: latestMenstrualCycle.cycle_length,
        menstrualLength: latestMenstrualCycle.menstrual_length,
      };
      setCycleData(parsedData);
      setNewPeriodDate(parsedData.lastPeriodStartDate);
    } else if (!loadingMenstrualCycle && !authLoading) {
      // If no cycle data and not loading, redirect to config
      navigate('/rastreador-ciclo', { replace: true });
    }
  }, [latestMenstrualCycle, loadingMenstrualCycle, authLoading, navigate]);

  useEffect(() => {
    if (cycleData) {
      const info = getCycleDayInfo(cycleData.lastPeriodStartDate, cycleData.cycleLength, cycleData.menstrualLength, selectedDate || new Date());
      setCycleDayInfo(info);
      const predicted = getPredictedDates(cycleData.lastPeriodStartDate, cycleData.cycleLength, cycleData.menstrualLength);
      setPredictedDates(predicted);
    }
  }, [cycleData, selectedDate]);

  const handleSaveDailyEntry = async (entryData: Partial<DailyEntry>) => {
    if (!user || !selectedDate || !cycleData || !dailyEntries) return;
    
    const existingEntry = dailyEntries.find(e => isSameDay(parseISO(e.entry_date), selectedDate));

    saveDailyEntryMutation.mutate(
      {
        userId: user.id,
        cycleId: cycleData.id,
        selectedDate: selectedDate,
        entryData: entryData,
        existingEntryId: existingEntry?.id,
      },
      {
        onSuccess: () => setIsLogDialogOpen(false),
      }
    );
  };

  const handleUpdateLastPeriodDate = async () => {
    if (!newPeriodDate || !cycleData) {
      showError("Por favor, selecione uma data válida.");
      return;
    }
    
    updateMenstrualCycleStartDateMutation.mutate(
      {
        cycleId: cycleData.id,
        newStartDate: newPeriodDate,
      },
      {
        onSuccess: () => setIsUpdatePeriodOpen(false),
      }
    );
  };

  const isLoadingPage = authLoading || loadingMenstrualCycle || loadingDailyEntries || !cycleData || !cycleDayInfo;

  if (isLoadingPage) {
    return <CycleTrackerDisplaySkeleton />; // Exibe o skeleton durante o carregamento
  }

  const { phase, dayInCycle, cycleLength, phaseContent } = cycleDayInfo;
  const progress = (dayInCycle / cycleLength) * 100;
  const colorClass = phaseContent.color.replace('bg-', 'text-').replace('-200', '-500');
  // const indicatorClass = phaseContent.progressColor; // Removido, pois agora usamos indicatorColorClass

  const infoItems = Object.entries(phaseContent)
    .filter(([key]) => ['energy', 'workout', 'body', 'cravings'].includes(key))
    .map(([key, value]) => ({ key, ...value as typeof PHASE_CONTENT['menstrual']['energy'] })); // Explicitly cast value

  const modifiers = {
    period: { from: cycleData.lastPeriodStartDate, to: addDays(cycleData.lastPeriodStartDate, cycleData.menstrualLength - 1) },
    ovulation: predictedDates?.ovulationDate,
    fertileWindow: predictedDates ? { from: predictedDates.fertileWindowStart, to: predictedDates.fertileWindowEnd } : undefined,
    today: new Date(),
    hasEntry: dailyEntries.map(entry => parseISO(entry.entry_date)),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6 text-center shadow-lg border-pink-100">
          <CardHeader className="flex flex-row items-center justify-center relative pb-4">
            <Droplet className={`h-8 w-8 mr-3 ${colorClass}`} />
            <CardTitle className="text-2xl font-bold text-slate-800">
              Seu Ciclo Hoje
            </CardTitle>
            <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={() => navigate('/rastreador-ciclo')}>
              <Edit className="h-5 w-5 text-slate-500" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress 
              progress={progress} 
              size={220} 
              strokeWidth={18} 
              indicatorColorClass={colorClass} // Usar a nova prop
            >
              <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="fill-slate-800">
                <tspan x="50%" dy="-0.2em" className="text-6xl font-bold">{dayInCycle}</tspan>
                <tspan x="50%" dy="1.4em" className="text-lg font-medium text-slate-500">/ {cycleLength} dias</tspan>
              </text>
            </CircularProgress>
            <p className="mt-4 text-xl font-semibold text-slate-700">
              Você está na fase <span className={`font-bold capitalize ${colorClass}`}>{phase}</span>.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg border-pink-100">
          <InfoAccordion items={infoItems} colorClass={colorClass} />
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold py-6 text-lg">
                <Plus className="h-5 w-5 mr-2" /> Registrar Sintomas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registro de {format(selectedDate || new Date(), 'dd/MM/yyyy', { locale: ptBR })}</DialogTitle>
              </DialogHeader>
              <DailyLogForm
                selectedDate={selectedDate}
                initialEntry={dailyEntries?.find(e => isSameDay(parseISO(e.entry_date), selectedDate || new Date())) || null}
                onSave={handleSaveDailyEntry}
                loading={saveDailyEntryMutation.isPending}
                onClose={() => setIsLogDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-2 gap-4">
            <Dialog open={isUpdatePeriodOpen} onOpenChange={setIsUpdatePeriodOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full font-bold py-6 text-lg">
                  <RefreshCw className="h-5 w-5 mr-2" /> Mudar Início
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Atualizar Início do Ciclo</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={newPeriodDate}
                  onSelect={setNewPeriodDate}
                  locale={ptBR}
                  disabled={(date) => isFuture(date)} // Fixed: Removed { unit: 'day' }
                />
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsUpdatePeriodOpen(false)}>Cancelar</Button>
                  <Button onClick={handleUpdateLastPeriodDate} disabled={updateMenstrualCycleStartDateMutation.isPending}>
                    {updateMenstrualCycleStartDateMutation.isPending ? 'Salvando...' : 'Salvar Nova Data'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full font-bold py-6 text-lg">
                  <CalendarDays className="h-5 w-5 mr-2" /> Calendário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                    setIsLogDialogOpen(true);
                  }}
                  locale={ptBR}
                  modifiers={modifiers}
                  // Removed classNames prop as it's causing type errors and styles are in globals.css
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTrackerDisplayPage;