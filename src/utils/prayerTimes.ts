import type {
  CalculationMethod as CalcMethodType,
  AsrSchool,
} from "./locationDetection";

export type PrayerItem = {
  key: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
  name: string;
  time: string;
  meridiem: string;
  minutes: number;
  date?: Date;
};

// Helper: Converts a Date to total local minutes from midnight, using local timezone
export function getLocalTimeMinutes(
  date: Date,
  lat: number,
  lon: number,
): number {
  return date.getHours() * 60 + date.getMinutes();
}

// Helper: Returns a copy of the Date but in the client's local timezone for matching
export function getLocalNowForCountdown(
  date: Date,
  lat: number,
  lon: number,
): Date {
  return new Date(date);
}

// Core function to calculate prayer times for any coordinate/date
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lon: number,
  method: CalcMethodType,
  school: AsrSchool,
): PrayerItem[] {
  // MOCK DATA for UI Template
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  const makeDate = (h: number, m: number) => {
    const newD = new Date(d);
    newD.setHours(h, m, 0, 0);
    return newD;
  };

  return [
    { key: "fajr", name: "الفجر", time: "4:30", meridiem: "ص", minutes: 4 * 60 + 30, date: makeDate(4, 30) },
    { key: "sunrise", name: "الشروق", time: "6:05", meridiem: "ص", minutes: 6 * 60 + 5, date: makeDate(6, 5) },
    { key: "dhuhr", name: "الظهر", time: "12:00", meridiem: "م", minutes: 12 * 60, date: makeDate(12, 0) },
    { key: "asr", name: "العصر", time: "3:30", meridiem: "م", minutes: 15 * 60 + 30, date: makeDate(15, 30) },
    { key: "maghrib", name: "المغرب", time: "6:45", meridiem: "م", minutes: 18 * 60 + 45, date: makeDate(18, 45) },
    { key: "isha", name: "العشاء", time: "8:15", meridiem: "م", minutes: 20 * 60 + 15, date: makeDate(20, 15) },
  ];
}
