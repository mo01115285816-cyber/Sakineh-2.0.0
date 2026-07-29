import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Star, 
  Moon, 
  Rewind, 
  FastForward, 
  Play, 
  Pause, 
  List, 
  Cast, 
  Volume2, 
  X, 
  Check, 
  VolumeX,
  Clock,
  Sparkles,
  Search,
  Shuffle,
  Repeat,
  Repeat1,
  Music,
  Video,
  VideoOff,
  Film
} from 'lucide-react';

// Transliterated English Names for Surahs
const SURAH_TRANSLITERATIONS: Record<number, string> = {
  1: "Al-Fatihah", 2: "Al-Baqarah", 3: "Aal-E-Imran", 4: "An-Nisa'", 5: "Al-Ma'idah",
  6: "Al-An'am", 7: "Al-A'raf", 8: "Al-Anfal", 9: "At-Tawbah", 10: "Yunus",
  11: "Hud", 12: "Yusuf", 13: "Ar-Ra'd", 14: "Ibrahim", 15: "Al-Hijr",
  16: "An-Nahl", 17: "Al-Isra'", 18: "Al-Kahf", 19: "Maryam", 20: "Taha",
  21: "Al-Anbiya'", 22: "Al-Hajj", 23: "Al-Mu'minun", 24: "An-Nur", 25: "Al-Furqan",
  26: "Ash-Shu'ara'", 27: "An-Naml", 28: "Al-Qasas", 29: "Al-Ankabut", 30: "Ar-Rum",
  31: "Luqman", 32: "As-Sajdah", 33: "Al-Ahzab", 34: "Saba'", 35: "Fatir",
  36: "Yasin", 37: "As-Saffat", 38: "Sad", 39: "Az-Zumar", 40: "Ghafir",
  41: "Fussilat", 42: "Ash-Shura", 43: "Az-Zukhruf", 44: "Ad-Dukhan", 45: "Al-Jathiyah",
  46: "Al-Ahqaf", 47: "Muhammad", 48: "Al-Fath", 49: "Al-Hujurat", 50: "Qaf",
  51: "Adh-Dhariyat", 52: "At-Tur", 53: "An-Najm", 54: "Al-Qamar", 55: "Ar-Rahman",
  56: "Al-Waqi'ah", 57: "Al-Hadid", 58: "Al-Mujadila", 59: "Al-Hashr", 60: "Al-Mumtahanah",
  61: "As-Saff", 62: "Al-Jumu'ah", 63: "Al-Munafiqun", 64: "At-Taghabun", 65: "At-Talaq",
  66: "At-Tahrim", 67: "Al-Mulk", 68: "Al-Qalam", 69: "Al-Haqqah", 70: "Al-Ma'arij",
  71: "Nuh", 72: "Al-Jinn", 73: "Al-Muzzammil", 74: "Al-Muddaththir", 75: "Al-Qiyamah",
  76: "Al-Insan", 77: "Al-Mursalat", 78: "An-Naba'", 79: "An-Nazi'at", 80: "'Abasa",
  81: "At-Takwir", 82: "Al-Infitar", 83: "Al-Mutaffifin", 84: "Al-Inshiqaq", 85: "Al-Buruj",
  86: "At-Tariq", 87: "Al-A'la", 88: "Al-Ghashiyah", 89: "Al-Fajr", 90: "Al-Balad",
  91: "Ash-Shams", 92: "Al-Layl", 93: "Ad-Duhaa", 94: "Ash-Sharh", 95: "At-Tin",
  96: "Al-'Alaq", 97: "Al-Qadr", 98: "Al-Bayyinah", 99: "Az-Zalzalah", 100: "Al-'Adiyat",
  101: "Al-Qari'ah", 102: "At-Takathur", 103: "Al-'Asr", 104: "Al-Humazah", 105: "Al-Fil",
  106: "Quraysh", 107: "Al-Ma'un", 108: "Al-Kawthar", 109: "Al-Kafirun", 110: "An-Nasr",
  111: "Al-Masad", 112: "Al-Ikhlas", 113: "Al-Falaq", 114: "An-Nas"
};

// Arabic Surah Names
const ARABIC_SURAH_NAMES: Record<number, string> = {
  1: "الفاتحة", 2: "البقرة", 3: "آل عمران", 4: "النساء", 5: "المائدة",
  6: "الأنعام", 7: "الأعراف", 8: "الأنفال", 9: "التوبة", 10: "يونس",
  11: "هود", 12: "يوسف", 13: "الرعد", 14: "إبراهيم", 15: "الحجر",
  16: "النحل", 17: "الإسراء", 18: "الكهف", 19: "مريم", 20: "طه",
  21: "الأنبيائ", 22: "الحج", 23: "المؤمنون", 24: "النور", 25: "الفرقان",
  26: "الشعراء", 27: "النمل", 28: "القصص", 29: "العنكبوت", 30: "الروم",
  31: "لقمان", 32: "السجدة", 33: "الأحزاب", 34: "سبأ", 35: "فاطر",
  36: "يس", 37: "الصافات", 38: "ص", 39: "الزمر", 40: "غافر",
  41: "فصلت", 42: "الشورى", 43: "الزخرف", 44: "الدخان", 45: "الجاثية",
  46: "الأحقاف", 47: "محمد", 48: "الفتح", 49: "الحجرات", 50: "ق",
  51: "الذاريات", 52: "الطور", 53: "النجم", 54: "القمر", 55: "الرحمن",
  56: "الواقعة", 57: "الحديد", 58: "المجادلة", 59: "الحشر", 60: "الممتحنة",
  61: "الصف", 62: "الجمعة", 63: "المنافقون", 64: "التغابن", 65: "الطلاق",
  66: "التحريم", 67: "الملك", 68: "القلم", 69: "الحاقة", 70: "المعارج",
  71: "نوح", 72: "الجن", 73: "المزمل", 74: "المدثر", 75: "القيامة",
  76: "الإنسان", 77: "المرسلات", 78: "النبأ", 79: "النازعات", 80: "عبس",
  81: "التكوير", 82: "الإنفطار", 83: "المطففين", 84: "الإنشقاق", 85: "البروج",
  86: "الطارق", 87: "الأعلى", 88: "الغاشية", 89: "الفجر", 90: "البلد",
  91: "الشمس", 92: "الليل", 93: "الضحى", 94: "الشرح", 95: "التين",
  96: "العلق", 97: "القدر", 98: "البينة", 99: "الزلزلة", 100: "العاديات",
  101: "القارعة", 102: "التكاثر", 103: "العصر", 104: "الهمزة", 105: "الفيل",
  106: "قريش", 107: "الماعون", 108: "الكوثر", 109: "الكافرون", 110: "النصر",
  111: "المسد", 112: "الإخلاص", 113: "الفلق", 114: "الناس"
};

interface Props {
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  reciter: {
    id: number;
    name: string;
    photoUrl?: string;
    photo?: string;
  };
  moshaf?: {
    id: number;
    name: string;
    server: string;
    surah_list: string;
  };
  surahId: number;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  timerMinutesRemaining: number | null;
  onSetTimer: (minutes: number | null) => void;
  repeatMode?: "none" | "one" | "all";
  onSetRepeatMode?: (mode: "none" | "one" | "all") => void;
  onOpenReader?: () => void;
  playlist?: number[];
  onPlaySurah?: (surahId: number, playlist: number[]) => void;
}

export function QuranAudioPlayerScreen({
  audioRef,
  reciter,
  moshaf,
  surahId,
  onClose,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  playbackRate,
  onPlaybackRateChange,
  timerMinutesRemaining,
  onSetTimer,
  repeatMode = "none",
  onSetRepeatMode,
  onOpenReader,
  playlist = [],
  onPlaySurah,
}: Props) {
  // Modal Sheet States
  const [activeSheet, setActiveSheet] = useState<"ambient" | "timer" | "speed" | "queue" | "volume" | "cast" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isShuffle, setIsShuffle] = useState(false);

  // Drag scrubbing states for progress bar
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientX: number) => {
    if (!trackRef.current || duration <= 0) return;
    setIsDragging(true);
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setDragProgress(percent);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !trackRef.current || duration <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setDragProgress(percent);
  };

  const handleDragEnd = () => {
    if (isDragging && dragProgress !== null) {
      const targetTime = (dragProgress / 100) * duration;
      onSeek(targetTime);
    }
    setIsDragging(false);
    setDragProgress(null);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      handleDragEnd();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, dragProgress, duration]);

  // Favorite Star state
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('quran_favorite_surahs') || '[]');
      return favs.includes(`${reciter.id}_${surahId}`);
    } catch {
      return false;
    }
  });

  const toggleFavorite = () => {
    const key = `${reciter.id}_${surahId}`;
    try {
      const favs = JSON.parse(localStorage.getItem('quran_favorite_surahs') || '[]');
      let updated: string[];
      if (favs.includes(key)) {
        updated = favs.filter((k: string) => k !== key);
        setIsFavorite(false);
      } else {
        updated = [...favs, key];
        setIsFavorite(true);
      }
      localStorage.setItem('quran_favorite_surahs', JSON.stringify(updated));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  // Video Background State
  const TOTAL_BG_VIDEOS = 10;

  const [bgVideoIndex, setBgVideoIndex] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('quran_player_bg_video');
      return saved !== null ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const selectBgVideo = (index: number | null) => {
    setBgVideoIndex(index);
    try {
      if (index === null) localStorage.removeItem('quran_player_bg_video');
      else localStorage.setItem('quran_player_bg_video', JSON.stringify(index));
    } catch {}
  };

  const isVideoTheme = bgVideoIndex !== null;

  // Time Formatting Helpers
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = () => {
    if (isNaN(duration) || duration <= 0) return "-00:51";
    const rem = Math.max(0, duration - currentTime);
    const mins = Math.floor(rem / 60);
    const secs = Math.floor(rem % 60);
    return `-${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Seek Progress calculation
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const currentProgressPercent = isDragging && dragProgress !== null ? dragProgress : progressPercent;

  // Reciter Photo Resolution
  const reciterPhoto = reciter.photoUrl || reciter.photo || "/images/quran_artwork.jpg";
  const transliteratedName = SURAH_TRANSLITERATIONS[surahId] || `Surah ${surahId}`;
  const arabicName = ARABIC_SURAH_NAMES[surahId] || `سورة ${surahId}`;

  // Surah list for Queue card
  const availableSurahs = useMemo(() => {
    if (!moshaf?.surah_list) return [];
    return moshaf.surah_list.split(',').map(Number).filter(id => id > 0 && id <= 114);
  }, [moshaf]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return availableSurahs;
    const q = searchQuery.trim().toLowerCase();
    return availableSurahs.filter(sId => {
      const eng = (SURAH_TRANSLITERATIONS[sId] || '').toLowerCase();
      const arb = ARABIC_SURAH_NAMES[sId] || '';
      return eng.includes(q) || arb.includes(q) || sId.toString().includes(q);
    });
  }, [availableSurahs, searchQuery]);

  return (
    <div 
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans min-h-screen transition-colors duration-500 ${
        isVideoTheme ? 'text-white' : 'text-[#2b1a10]'
      }`}
      dir="ltr"
    >
      {/* Layered background transitions (Z-axis bottom-most) */}
      <div 
        className={`absolute inset-0 -z-20 transition-colors duration-500 ${
          isVideoTheme ? 'bg-black' : 'bg-[#ece7de]'
        }`} 
      />

      {bgVideoIndex !== null && (
        <video
          key={bgVideoIndex}
          className="absolute inset-0 -z-10 w-full h-full object-cover pointer-events-none"
          src={`/videos/${bgVideoIndex + 1}.mp4`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={(e) => console.warn('Background video failed to load:', e.currentTarget.src)}
        />
      )}

      {/* Top Ambient Light Glow Overlay (Static mode only) */}
      {!isVideoTheme && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#b88a4f]/12 via-transparent to-[#deab65]/15 pointer-events-none z-0" />
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle at 50% 100%, rgba(222, 171, 101, 0.28) 0%, rgba(236, 231, 222, 0) 75%)'
            }}
          />
        </>
      )}

      {/* ─────────────────── TOP BAR ─────────────────── */}
      <header className="relative z-10 pt-3 px-6 flex flex-col items-center shrink-0">
        {/* Swipe Handle Indicator Bar */}
        <button 
          onClick={onClose}
          aria-label="Close player"
          className={`w-12 h-1 rounded-full cursor-pointer transition-colors mb-3.5 ${
            isVideoTheme ? 'bg-white/40 hover:bg-white/60' : 'bg-[#2b1a10]/20 hover:bg-[#2b1a10]/35'
          }`}
        />

        {/* Top Dropdown Pill ("الخلفيات") */}
        <button
          onClick={() => setActiveSheet(activeSheet === 'ambient' ? null : 'ambient')}
          className={`hover:opacity-90 active:scale-95 transition-all border rounded-full px-5 py-2 font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer backdrop-blur-md ${
            isVideoTheme
              ? 'bg-white/12 border-white/30 text-white saturate-[180%] brightness-[1.1]'
              : 'cut-crystal-capsule border-[#2b1a10]/10 text-[#2b1a10]'
          }`}
          dir="rtl"
        >
          <span className="text-[14px] font-bold tracking-wide">
            الخلفيات
          </span>
          <ChevronDown size={16} className={isVideoTheme ? "text-white" : "text-[#b88a4f]"} />
        </button>
      </header>


      {/* ─────────────────── FLOATING QUEUE CARD (متابعة التشغيل) ─────────────────── */}
      <AnimatePresence>
        {activeSheet === 'queue' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`absolute top-[72px] inset-x-5 z-40 rounded-[30px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col h-[285px] sm:h-[300px] backdrop-blur-2xl border ${
              isVideoTheme
                ? 'bg-white/12 border-white/30 text-white saturate-[180%] brightness-[1.1]'
                : 'bg-[#fdfcfb]/98 border-[#2b1a10]/10 text-[#2b1a10]'
            }`}
            dir="rtl"
          >
            {/* Header Row: Title on right, Action Buttons on left */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSetRepeatMode) {
                      const nextMode = repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
                      onSetRepeatMode(nextMode);
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    repeatMode !== 'none' 
                      ? 'bg-gradient-to-r from-[#deab65] to-[#b88a4f] text-white font-bold shadow-sm' 
                      : isVideoTheme ? 'bg-white/10 text-white' : 'cut-crystal-capsule text-[#7f6a55]'
                  }`}
                  aria-label="Repeat mode"
                >
                  {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
                </button>

                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isShuffle 
                      ? 'bg-gradient-to-r from-[#deab65] to-[#b88a4f] text-white font-bold shadow-sm' 
                      : isVideoTheme ? 'bg-white/10 text-white' : 'cut-crystal-capsule text-[#7f6a55]'
                  }`}
                  aria-label="Shuffle"
                >
                  <Shuffle size={15} />
                </button>
              </div>

              <h3 className={`text-lg font-bold tracking-wide ${isVideoTheme ? 'text-white' : 'text-[#2b1a10]'}`}>
                متابعة التشغيل
              </h3>
            </div>

            {/* Fully Rounded Search Bar */}
            <div className="relative w-full mb-2.5">
              <input
                type="text"
                placeholder="بحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 pr-9 pl-4 text-sm rounded-full focus:outline-none transition-colors text-right ${
                  isVideoTheme
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/50'
                    : 'cut-crystal-input text-[#2b1a10] placeholder-[#7f6a55]/60'
                }`}
              />
              <Search size={15} className="absolute right-3.5 top-2.5 text-[#b88a4f] pointer-events-none" />
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
              {filteredSurahs.map((sId) => {
                const isCurrent = sId === surahId;
                const sArabic = ARABIC_SURAH_NAMES[sId] || `سورة ${sId}`;
                const sEnglish = SURAH_TRANSLITERATIONS[sId] || `Surah ${sId}`;

                if (isCurrent) {
                  return (
                    <div
                      key={sId}
                      className="w-full p-2.5 rounded-2xl bg-[#f5ebd6] border border-[#c49a62] flex items-center justify-between text-[#2b1a10] shadow-sm"
                    >
                      <button
                        onClick={onTogglePlay}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#deab65] to-[#b88a4f] text-white flex items-center justify-center active:scale-95 transition-transform shrink-0 shadow-xs"
                      >
                        {isPlaying ? <Pause size={15} className="fill-white" /> : <Play size={15} className="fill-white translate-x-[0.5px]" />}
                      </button>

                      <div className="flex-1 text-right px-3 min-w-0">
                        <p className="text-base font-bold text-[#2b1a10] leading-snug truncate">{sEnglish}</p>
                        <p className="text-xs text-[#7f6a55] font-bold truncate">{sArabic}</p>
                      </div>

                      <div className="w-11 h-11 rounded-2xl bg-[#ece7de] border border-[#2b1a10]/08 flex items-center justify-center shrink-0">
                        <div className="flex items-center gap-0.5 text-[#b88a4f]">
                          <div className="w-0.5 h-3 bg-[#b88a4f] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-0.5 h-4 bg-[#b88a4f] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-0.5 h-2.5 bg-[#b88a4f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          <div className="w-0.5 h-3.5 bg-[#b88a4f] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={sId}
                    onClick={() => {
                      if (onPlaySurah) {
                        onPlaySurah(sId, availableSurahs);
                      }
                    }}
                    className={`w-full p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                      isVideoTheme
                        ? 'hover:bg-white/10 text-white'
                        : 'hover:bg-[#2b1a10]/5 text-[#2b1a10]'
                    }`}
                  >
                    <div className="w-8 h-8 shrink-0" />
                    <div className="flex-1 text-right px-3 min-w-0">
                      <p className="text-base font-bold leading-snug truncate">{sEnglish}</p>
                      <p className={`text-xs font-medium truncate ${isVideoTheme ? 'text-white/70' : 'text-[#7f6a55]'}`}>{sArabic}</p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-[#f5ebd6] border border-[#2b1a10]/08 flex items-center justify-center text-lg font-bold text-[#b88a4f] shrink-0">
                      {sId}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ─────────────────── MAIN METADATA BLOCK ─────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-2">
        <div className="flex items-center justify-between w-full mb-8">
          
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-sm shrink-0 cursor-pointer active:scale-95 backdrop-blur-md ${
              isVideoTheme ? 'bg-white/12 border border-white/30 text-white saturate-[180%] brightness-[1.1]' : 'cut-crystal-capsule'
            }`}
            aria-label="Favorite surah"
          >
            <Star 
              size={16} 
              className={isFavorite ? "fill-[#deab65] text-[#b88a4f] drop-shadow-xs" : isVideoTheme ? "text-white/70" : "text-[#7f6a55]"} 
            />
          </button>

          {/* Title & Sheikh Info */}
          <div className="flex items-center gap-4 text-right">
            <div className="flex flex-col items-end">
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight leading-tight ${isVideoTheme ? 'text-white drop-shadow-md' : 'text-[#2b1a10]'}`}>
                {transliteratedName}
              </h2>
              <p className={`text-[15px] sm:text-[16px] font-bold font-sans mt-0.5 ${isVideoTheme ? 'text-amber-200/90 drop-shadow-sm' : 'text-[#7f6a55]'}`} dir="rtl">
                {reciter.name}
              </p>
            </div>

            {/* Sheikh Avatar */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#c49a62] shadow-[0_8px_24px_rgba(0,0,0,0.3)] shrink-0 bg-[#f5ebd6]">
              <img 
                src={reciterPhoto} 
                alt={reciter.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/quran_artwork.jpg";
                }}
              />
            </div>
          </div>

        </div>

        {/* ─────────────────── PLAYBACK CONTROLS ROW ─────────────────── */}
        <div className="flex items-center justify-between w-full px-2 mb-8">
          
          {/* 1. Sleep Timer */}
          <button
            onClick={() => setActiveSheet(activeSheet === 'timer' ? null : 'timer')}
            className={`transition-all active:scale-90 cursor-pointer flex items-center justify-center relative ${
              isVideoTheme 
                ? 'p-2 text-[#deab65] hover:text-white drop-shadow-md' 
                : 'p-2 text-[#7f6a55] hover:text-[#2b1a10]'
            }`}
            aria-label="Sleep timer"
          >
            <div className="relative">
              <Moon size={22} strokeWidth={2.2} />
              {timerMinutesRemaining !== null && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#deab65] animate-pulse" />
              )}
            </div>
          </button>

          {/* 2. Skip Back (◀◀) */}
          <button
            onClick={() => {
              if (currentTime > 5) {
                onSeek(Math.max(0, currentTime - 10));
              } else {
                onPrev();
              }
            }}
            className={`transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
              isVideoTheme 
                ? 'w-10 h-10 rounded-full bg-[#deab65]/10 hover:bg-[#deab65]/20 border border-[#deab65]/30 text-[#deab65] hover:text-white backdrop-blur-md shadow-md' 
                : 'p-2 text-[#2b1a10] hover:text-[#b88a4f]'
            }`}
            aria-label="Previous or Rewind"
          >
            <Rewind size={isVideoTheme ? 18 : 28} className="fill-current" />
          </button>

          {/* 3. Main Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
              isVideoTheme
                ? 'w-14 h-14 rounded-full bg-gradient-to-br from-[#deab65]/15 to-[#b88a4f]/20 text-[#deab65] hover:text-white border-2 border-[#deab65]/35 hover:border-[#deab65] shadow-[0_8px_32px_rgba(222,171,101,0.15)] backdrop-blur-md saturate-[150%] brightness-[1.05] hover:scale-105'
                : 'w-14 h-14 rounded-full bg-gradient-to-br from-[#deab65] to-[#b88a4f] text-white shadow-[0_10px_28px_rgba(184,138,79,0.4)] border border-[#c49a62]'
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={isVideoTheme ? 24 : 38} className={isVideoTheme ? "fill-current text-current" : "fill-white text-white"} />
            ) : (
              <Play size={isVideoTheme ? 24 : 38} className={isVideoTheme ? "fill-current text-current translate-x-[1px]" : "fill-white text-white translate-x-[2px]"} />
            )}
          </button>

          {/* 4. Skip Forward (▶▶) */}
          <button
            onClick={() => {
              if (duration && (duration - currentTime) > 10) {
                onSeek(Math.min(duration, currentTime + 10));
              } else {
                onNext();
              }
            }}
            className={`transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
              isVideoTheme 
                ? 'w-10 h-10 rounded-full bg-[#deab65]/10 hover:bg-[#deab65]/20 border border-[#deab65]/30 text-[#deab65] hover:text-white backdrop-blur-md shadow-md' 
                : 'p-2 text-[#2b1a10] hover:text-[#b88a4f]'
            }`}
            aria-label="Next or Fast forward"
          >
            <FastForward size={isVideoTheme ? 18 : 28} className="fill-current" />
          </button>

          {/* 5. Playback Speed Selector */}
          <button
            onClick={() => setActiveSheet(activeSheet === 'speed' ? null : 'speed')}
            className={`transition-all active:scale-90 cursor-pointer flex items-center justify-center font-bold ${
              isVideoTheme 
                ? 'p-2 text-[#deab65] hover:text-white text-base drop-shadow-md' 
                : 'p-2 text-[#b88a4f] hover:text-[#2b1a10] text-base'
            }`}
            aria-label="Playback speed"
          >
            ×{playbackRate}
          </button>

        </div>

        {/* ─────────────────── SEEK BAR & TIMERS ─────────────────── */}
        <div className="w-full flex flex-col mb-6">
          <div 
            ref={trackRef}
            className={`relative w-full rounded-full cursor-pointer transition-[height] duration-150 select-none flex items-center group overflow-hidden ${
              isDragging ? 'h-3' : 'h-1.5 hover:h-3'
            } ${
              isVideoTheme
                ? 'bg-white/15 border border-white/10 backdrop-blur-xs'
                : 'bg-[#2b1a10]/12'
            }`}
            onMouseDown={(e) => {
              handleDragStart(e.clientX);
            }}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handleDragStart(e.touches[0].clientX);
              }
            }}
          >
            <div 
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#deab65] to-[#b88a4f] rounded-full h-full"
              style={{ width: `${currentProgressPercent}%` }}
            />
          </div>

          <div className={`flex items-center justify-between w-full mt-2 text-sm font-bold font-mono tracking-tight ${
            isVideoTheme ? 'text-white/80' : 'text-[#7f6a55]'
          }`}>
            <span>{formatRemainingTime()}</span>
            <span>{formatTime(isDragging && dragProgress !== null ? (dragProgress / 100) * duration : currentTime)}</span>
          </div>
        </div>
      </main>


      {/* ─────────────────── BOTTOM ACTION BAR ─────────────────── */}
      <footer className="relative z-10 px-8 pb-8 pt-2 flex items-center justify-between bg-transparent shrink-0">
        
        {/* Queue */}
        <button
          onClick={() => setActiveSheet(activeSheet === 'queue' ? null : 'queue')}
          className={`transition-all cursor-pointer ${
            isVideoTheme
              ? `w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border ${
                  activeSheet === 'queue'
                    ? 'bg-[#deab65] text-white border-[#deab65] shadow-lg scale-110'
                    : 'bg-white/12 hover:bg-white/20 text-white/80 hover:text-white border-white/25 shadow-md active:scale-95'
                }`
              : `p-3 ${activeSheet === 'queue' ? 'text-[#b88a4f] scale-110' : 'text-[#7f6a55] hover:text-[#2b1a10]'}`
          }`}
          aria-label="Surahs list"
        >
          <List size={isVideoTheme ? 18 : 26} strokeWidth={2.2} />
        </button>

        {/* Cast */}
        <button
          onClick={() => setActiveSheet(activeSheet === 'cast' ? null : 'cast')}
          className={`transition-all cursor-pointer ${
            isVideoTheme
              ? `w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border ${
                  activeSheet === 'cast'
                    ? 'bg-[#deab65] text-white border-[#deab65] shadow-lg scale-110'
                    : 'bg-white/12 hover:bg-white/20 text-white/80 hover:text-white border-white/25 shadow-md active:scale-95'
                }`
              : `p-3 ${activeSheet === 'cast' ? 'text-[#b88a4f] scale-110' : 'text-[#7f6a55] hover:text-[#2b1a10]'}`
          }`}
          aria-label="Cast audio"
        >
          <Cast size={isVideoTheme ? 16 : 24} strokeWidth={2.2} />
        </button>

        {/* Quran Text View */}
        <button
          onClick={() => {
            if (onOpenReader) onOpenReader();
          }}
          className={`transition-all cursor-pointer flex items-center justify-center ${
            isVideoTheme
              ? 'w-10 h-10 rounded-full backdrop-blur-md border bg-white/12 hover:bg-white/20 text-white border-white/25 shadow-md active:scale-95'
              : `p-3 active:scale-90 ${isVideoTheme ? 'text-white hover:text-[#deab65]' : 'text-[#2b1a10] hover:text-[#b88a4f]'}`
          }`}
          aria-label="Open Quran text reader"
        >
          <span className={`${isVideoTheme ? 'text-base' : 'text-2xl'} font-black font-serif leading-none select-none drop-shadow-xs`}>
            ق
          </span>
        </button>

        {/* Volume & Sound Effects */}
        <button
          onClick={() => setActiveSheet(activeSheet === 'volume' ? null : 'volume')}
          className={`transition-all cursor-pointer ${
            isVideoTheme
              ? `w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border ${
                  activeSheet === 'volume'
                    ? 'bg-[#deab65] text-white border-[#deab65] shadow-lg scale-110'
                    : 'bg-white/12 hover:bg-white/20 text-white/80 hover:text-white border-white/25 shadow-md active:scale-95'
                }`
              : `p-3 ${activeSheet === 'volume' ? 'text-[#b88a4f] scale-110' : 'text-[#7f6a55] hover:text-[#2b1a10]'}`
          }`}
          aria-label="Volume settings"
        >
          <Volume2 size={isVideoTheme ? 18 : 26} strokeWidth={2.2} />
        </button>

      </footer>


      {/* ─────────────────── MODALS / BOTTOM SHEETS ─────────────────── */}

      {/* Sheet 1: Background Video ("الخلفيات") */}
      <AnimatePresence>
        {activeSheet === 'ambient' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bottom-0 inset-x-0 z-50 backdrop-blur-2xl border-t p-6 pb-10 flex flex-col max-h-[82vh] text-white shadow-[0_-10px_40px_rgba(0,0,0,0.3)] rounded-t-[32px] ${
                isVideoTheme 
                  ? 'bg-white/12 border-white/30 saturate-[180%] brightness-[1.1]' 
                  : 'bg-[#1a1512]/98 border-white/15'
              }`}
              dir="rtl"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              
              {/* Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#deab65]" />
                  <h3 className="text-lg font-bold text-white">خلفيات الشاشة</h3>
                </div>
                <button
                  onClick={() => setActiveSheet(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: TOTAL_BG_VIDEOS }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { selectBgVideo(i); setActiveSheet(null); }}
                    className={`aspect-square rounded-2xl flex items-center justify-center font-bold text-base transition-all cursor-pointer ${
                      bgVideoIndex === i
                        ? 'bg-emerald-400/20 border border-emerald-400 text-emerald-400'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { selectBgVideo(null); setActiveSheet(null); }}
                className="mt-4 w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-red-500/20"
              >
                <VideoOff size={16} />
                إيقاف الفيديو
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sheet 2: Sleep Timer ("مؤقت النوم") */}
      <AnimatePresence>
        {activeSheet === 'timer' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bottom-0 inset-x-0 z-50 backdrop-blur-2xl border-t p-6 pb-10 flex flex-col text-white shadow-[0_-10px_40px_rgba(0,0,0,0.3)] rounded-t-[32px] ${
                isVideoTheme 
                  ? 'bg-white/12 border-white/30 saturate-[180%] brightness-[1.1]' 
                  : 'bg-[#1a1512]/98 border-white/15'
              }`}
              dir="rtl"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Moon size={18} className="text-[#deab65]" />
                  <h3 className="text-lg font-bold text-white">مؤقت النوم الإيقاف التلقائي</h3>
                </div>
                <button
                  onClick={() => setActiveSheet(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "إيقاف المؤقت", minutes: null },
                  { label: "٥ دقائق", minutes: 5 },
                  { label: "١٠ دقائق", minutes: 10 },
                  { label: "١٥ دقيقة", minutes: 15 },
                  { label: "٣٠ دقيقة", minutes: 30 },
                  { label: "٤٥ دقيقة", minutes: 45 },
                  { label: "ساعة كاملة", minutes: 60 },
                ].map((item, idx) => {
                  const isSelected = item.minutes === null 
                    ? timerMinutesRemaining === null 
                    : timerMinutesRemaining !== null && Math.abs(timerMinutesRemaining - item.minutes) < 1;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onSetTimer(item.minutes);
                        setActiveSheet(null);
                      }}
                      className={`p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#deab65] to-[#b88a4f] text-white shadow-md scale-[1.02]' 
                          : isVideoTheme
                            ? 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check size={18} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Sheet 3: Playback Speed ("سرعة التشغيل") */}
      <AnimatePresence>
        {activeSheet === 'speed' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bottom-0 inset-x-0 z-50 backdrop-blur-2xl border-t p-6 pb-10 flex flex-col text-white shadow-[0_-10px_40px_rgba(0,0,0,0.3)] rounded-t-[32px] ${
                isVideoTheme 
                  ? 'bg-white/12 border-white/30 saturate-[180%] brightness-[1.1]' 
                  : 'bg-[#1a1512]/98 border-white/15'
              }`}
              dir="rtl"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#deab65]" />
                  <h3 className="text-lg font-bold text-white">سرعة التشغيل</h3>
                </div>
                <button
                  onClick={() => setActiveSheet(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { rate: 0.5, label: "0.5x - بطيء جداً" },
                  { rate: 0.75, label: "0.75x - بطيء" },
                  { rate: 1.0, label: "1.0x - عادي (افتراضي)" },
                  { rate: 1.25, label: "1.25x - سريع" },
                  { rate: 1.5, label: "1.5x - سريع جداً" },
                  { rate: 2.0, label: "2.0x - ضعف السرعة" },
                ].map((item) => {
                  const isSelected = playbackRate === item.rate;
                  return (
                    <button
                      key={item.rate}
                      onClick={() => {
                        onPlaybackRateChange(item.rate);
                        setActiveSheet(null);
                      }}
                      className={`w-full p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#deab65] to-[#b88a4f] text-white shadow-md' 
                          : isVideoTheme
                            ? 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check size={18} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Sheet 5: Floating Volume & Sound Controls Card */}
      <AnimatePresence>
        {activeSheet === 'volume' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 25 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`fixed bottom-24 inset-x-5 z-50 max-w-sm mx-auto backdrop-blur-2xl border rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-6 text-white select-none ${
                isVideoTheme
                  ? 'bg-white/12 border-white/30 saturate-[180%] brightness-[1.1]'
                  : 'bg-[#1a1512]/98 border-white/15'
              }`}
              dir="rtl"
            >
              {/* Section 1: Quran Recitation Volume */}
              <div className="flex flex-col gap-2.5">
                <div className="text-right font-bold text-lg text-white">
                  صوت تلاوة القرآن
                </div>
                <div className="flex items-center gap-3.5" dir="ltr">
                  <button 
                    onClick={() => onVolumeChange(1)}
                    className="text-[#deab65] hover:text-white transition-colors shrink-0"
                    aria-label="Max volume"
                  >
                    <Volume2 size={22} />
                  </button>

                  <div className="relative flex-1 flex items-center h-6 group">
                    <div className="absolute inset-x-0 h-1.5 bg-white/20 rounded-full pointer-events-none transition-[height] duration-150 group-hover:h-3" />
                    <div 
                      className="absolute left-0 h-1.5 bg-gradient-to-r from-[#deab65] to-[#b88a4f] rounded-full pointer-events-none transition-[height] duration-150 group-hover:h-3" 
                      style={{ width: `${volume * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </div>

                  <button 
                    onClick={() => onVolumeChange(0)}
                    className="text-[#deab65] hover:text-white transition-colors shrink-0"
                    aria-label="Mute volume"
                  >
                    <VolumeX size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Sheet 6: Cast / Wireless Broadcast Modal */}
      <AnimatePresence>
        {activeSheet === 'cast' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bottom-0 inset-x-0 z-50 backdrop-blur-2xl border-t p-6 pb-10 flex flex-col text-center text-white shadow-[0_-10px_40px_rgba(0,0,0,0.3)] rounded-t-[32px] ${
                isVideoTheme 
                  ? 'bg-white/12 border-white/30 saturate-[180%] brightness-[1.1]' 
                  : 'bg-[#1a1512]/98 border-white/15'
              }`}
              dir="rtl"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              
              <div className="w-16 h-16 rounded-full bg-white/10 text-[#deab65] flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Cast size={32} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">البث اللاسلكي والأجهزة المجاورة</h3>
              <p className="text-sm text-white/70 mb-6 max-w-xs mx-auto font-medium">
                يمكنك توصيل تطبيق السكينة بأجهزة Chromecast أو Bluetooth أو AirPlay للاستماع بجودة عالية.
              </p>

              <button
                onClick={() => setActiveSheet(null)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#deab65] to-[#b88a4f] text-white font-bold text-base shadow-md active:scale-95 transition-all cursor-pointer"
              >
                حسناً، فهمت
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default QuranAudioPlayerScreen;
