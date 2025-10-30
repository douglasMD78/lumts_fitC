import { addDays, differenceInDays, isBefore, startOfDay } from 'date-fns';

export type CyclePhase = 'menstrual' | 'folicular' | 'ovulatoria' | 'lutea';

export interface CyclePhaseInfo {
  phase: CyclePhase;
  dayInCycle: number;
  cycleLength: number;
}

// Helper to get phase based on day, menstrualLength, and cycleLength
const getPhaseForDay = (
  dayInCycle: number,
  menstrualLength: number,
  cycleLength: number
): CyclePhase => {
  // Phase definitions based on briefing
  const ovulatoryStartDay = cycleLength - 14; // Day 15 for a 28-day cycle
  const ovulatoryEndDay = cycleLength - 12;   // Day 17 for a 28-day cycle
  const folicularEndDay = ovulatoryStartDay - 1;

  if (dayInCycle >= 1 && dayInCycle <= menstrualLength) {
    return 'menstrual';
  } else if (dayInCycle > menstrualLength && dayInCycle <= folicularEndDay) {
    return 'folicular';
  } else if (dayInCycle >= ovulatoryStartDay && dayInCycle <= ovulatoryEndDay) {
    return 'ovulatoria';
  } else if (dayInCycle > ovulatoryEndDay && dayInCycle <= cycleLength) {
    return 'lutea';
  }
  // Fallback for unexpected dayInCycle values (should not happen if inputs are valid)
  console.warn(`Day ${dayInCycle} is outside expected cycle phase ranges for cycleLength ${cycleLength} and menstrualLength ${menstrualLength}.`);
  return 'folicular'; // Default to follicular
};


export function getCycleDayInfo(
  lastPeriodStartDate: Date,
  cycleLength: number,
  menstrualLength: number,
  today: Date = new Date(),
): CyclePhaseInfo | null {
  const startOfToday = startOfDay(today);
  const startOfLastPeriod = startOfDay(lastPeriodStartDate);

  if (isBefore(startOfToday, startOfLastPeriod)) {
    return null; // Today cannot be before the last period start
  }

  let dayInCycle = differenceInDays(startOfToday, startOfLastPeriod) + 1;

  // Adjust dayInCycle if it exceeds the cycleLength to wrap around
  if (dayInCycle > cycleLength) {
    dayInCycle = ((dayInCycle - 1) % cycleLength) + 1;
  }

  const phase = getPhaseForDay(dayInCycle, menstrualLength, cycleLength);

  return {
    phase,
    dayInCycle,
    cycleLength,
  };
}

export function getPredictedDates(
  lastPeriodStartDate: Date,
  cycleLength: number,
  menstrualLength: number,
) {
  const startOfLastPeriod = startOfDay(lastPeriodStartDate);

  const nextPeriodStartDate = addDays(startOfLastPeriod, cycleLength);

  // Ovulatory window as defined in the briefing
  const ovulatoryStartDay = cycleLength - 14;
  const ovulatoryEndDay = cycleLength - 12;

  const ovulationDate = addDays(startOfLastPeriod, ovulatoryStartDay); // Using start of ovulatory window as a proxy for "ovulation date"
  const fertileWindowStart = addDays(startOfLastPeriod, ovulatoryStartDay - 2); // 2 days before ovulatory window start
  const fertileWindowEnd = addDays(startOfLastPeriod, ovulatoryEndDay + 1); // 1 day after ovulatory window end

  return {
    nextPeriodStartDate,
    ovulationDate, // This is now the start of the ovulatory window
    fertileWindowStart,
    fertileWindowEnd,
  };
}