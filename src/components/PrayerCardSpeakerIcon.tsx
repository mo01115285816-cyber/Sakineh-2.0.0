import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Vibrate, Radio } from "lucide-react";
import {
  SinglePrayerPreference,
  PrayerNotificationMode,
} from "../types/prayer-settings";

interface PrayerCardSpeakerIconProps {
  prayerId: string;
  prayerDisplayName: string;
  onClick: (e: React.MouseEvent) => void;
  // Trigger update when settings are saved
  refreshTrigger?: number;
  isActive?: boolean;
  noBg?: boolean;
}

const DEFAULT_PREFS: Record<
  string,
  Omit<SinglePrayerPreference, "prayerId" | "prayerDisplayName">
> = {
  fajr: { enabled: true, mode: "beep", selectedMuezzinId: "ali_mulla" },
  dhuhr: { enabled: true, mode: "beep", selectedMuezzinId: "ali_mulla" },
  asr: { enabled: true, mode: "beep", selectedMuezzinId: "ali_mulla" },
  maghrib: { enabled: true, mode: "beep", selectedMuezzinId: "ali_mulla" },
  isha: { enabled: true, mode: "beep", selectedMuezzinId: "ali_mulla" },
};

export const PrayerCardSpeakerIcon = React.memo(function PrayerCardSpeakerIcon({
  prayerId,
  prayerDisplayName,
  onClick,
  refreshTrigger = 0,
  isActive = false,
  noBg = false,
}: PrayerCardSpeakerIconProps) {
  const [pref, setPref] = useState<SinglePrayerPreference>({
    prayerId,
    prayerDisplayName,
    enabled: true,
    mode: "beep",
  });

  // Load preferences from localStorage on mount or refresh trigger
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`app_prayer_pref_${prayerId}`);
      if (saved) {
        setPref(JSON.parse(saved));
      } else {
        const defaults = DEFAULT_PREFS[prayerId] || {
          enabled: true,
          mode: "beep",
          selectedMuezzinId: "ali_mulla",
        };
        setPref({
          prayerId,
          prayerDisplayName,
          ...defaults,
        });
      }
    } catch (e) {
      console.warn("Failed to read prayer pref inside speaker icon", e);
    }
  }, [prayerId, prayerDisplayName, refreshTrigger]);

  // Determine which icon and style to render
  const iconConfig = React.useMemo(() => {
    if (noBg) {
      const iconSize = 18;
      if (!pref.enabled || pref.mode === "silent") {
        return {
          icon: (
            <VolumeX
              size={iconSize}
              className={isActive ? "text-[#b88a4f]" : "text-[#7f6a55]/60"}
            />
          ),
          className: "p-1 bg-transparent border-none hover:opacity-80",
          title: "صامت",
        };
      }
      switch (pref.mode) {
        case "vibrate_only":
          return {
            icon: (
              <Vibrate
                size={iconSize}
                className={isActive ? "text-[#b88a4f]" : "text-[#7f6a55]"}
              />
            ),
            className: "p-1 bg-transparent border-none hover:opacity-80",
            title: "اهتزاز فقط",
          };
        case "azan_short":
        case "azan_full":
          return {
            icon: (
              <Radio
                size={iconSize}
                className={`${isActive ? "text-[#b88a4f]" : "text-[#b88a4f]"} animate-pulse`}
              />
            ),
            className: "p-1 bg-transparent border-none hover:opacity-80",
            title: "أذان نشط",
          };
        case "beep":
        default:
          return {
            icon: (
              <Volume2
                size={iconSize}
                className={isActive ? "text-[#b88a4f]" : "text-[#2b1a10]"}
              />
            ),
            className: "p-1 bg-transparent border-none hover:opacity-80",
            title: "نغمة التنبيه",
          };
      }
    }

    if (!pref.enabled || pref.mode === "silent") {
      return {
        icon: (
          <VolumeX
            size={15}
            className={isActive ? "text-white/70" : "text-[#7f6a55]/60"}
          />
        ),
        className: `w-8.5 h-8.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
          isActive
            ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
            : "bg-[#f7f2ea]/50 border-[#e6dccf]/40 hover:bg-[#f7f2ea]"
        }`,
        title: "صامت",
      };
    }

    switch (pref.mode) {
      case "vibrate_only":
        return {
          icon: (
            <Vibrate
              size={15}
              className={isActive ? "text-white" : "text-[#7f6a55]"}
            />
          ),
          className: `w-8.5 h-8.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isActive
              ? "bg-white/15 border-white/25 hover:bg-white/25 text-white"
              : "bg-[#f7f2ea] border-[#e6dccf] hover:bg-[#e6dccf]/30"
          }`,
          title: "اهتزاز فقط",
        };
      case "azan_short":
      case "azan_full":
        return {
          icon: (
            <Radio
              size={15}
              className={
                isActive
                  ? "text-[#b88a4f] animate-pulse"
                  : "text-white animate-pulse"
              }
            />
          ),
          className: `w-8.5 h-8.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isActive
              ? "bg-white border-white shadow-sm hover:bg-white/95 text-[#b88a4f]"
              : "bg-gradient-to-b from-[#deab65] to-[#b88a4f] border-[#b88a4f] shadow-sm hover:opacity-95 text-white"
          }`,
          title: "أذان نشط",
        };
      case "beep":
      default:
        return {
          icon: (
            <Volume2
              size={15}
              className={isActive ? "text-white" : "text-[#b88a4f]"}
            />
          ),
          className: `w-8.5 h-8.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isActive
              ? "bg-white/20 border-white/30 hover:bg-white/30 text-white"
              : "bg-[#b88a4f]/10 border-[#b88a4f]/20 hover:bg-[#b88a4f]/25"
          }`,
          title: "نغمة التنبيه",
        };
    }
  }, [pref, isActive, noBg]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`transition-all duration-300 active:scale-90 cursor-pointer ${iconConfig.className}`}
      title={`${prayerDisplayName}: ${iconConfig.title}`}
    >
      {iconConfig.icon}
    </button>
  );
});
