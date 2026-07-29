export type PrayerNotificationMode =
  | "beep" // نغمة التنبيه (الافتراضي)
  | "azan_short" // صوت الأذان (مختصر/عادي)
  | "azan_full" // الأذان الكامل (مؤذن مخصص)
  | "vibrate_only" // اهتزاز فقط
  | "silent"; // صامت

export interface MuezzinTrack {
  id: string;
  name: string; // e.g., "علي أحمد ملا"
  url: string; // Reliable high-quality CDN/audio URL (MP3/WAV)
  fileName: string; // e.g., "ali_mulla_azan.mp3"
  isDownloaded?: boolean;
}

export interface SinglePrayerPreference {
  prayerId: string; // 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'duha' | 'midnight' | 'tahajjud'
  prayerDisplayName: string; // 'الفجر' | 'الظهر' ...
  enabled: boolean; // إشعارات الصلاة (On/Off toggle)
  mode: PrayerNotificationMode;
  selectedMuezzinId?: string; // If mode === 'azan_full' or 'azan_short'
}

export type AllPrayersPreferences = Record<string, SinglePrayerPreference>;
