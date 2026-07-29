import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LogOut,
  X,
  Play,
  Pause,
  BookOpen,
  Loader2,
  Moon,
  Sun,
  Settings,
  Image as ImageIcon,
  ChevronRight,
  Copy,
  Check,
  Bookmark,
  Palette,
  AlertCircle,
} from "lucide-react";
import { surahNames } from "@/data/surahNames";


const SURAH_START_PAGES: Record<number, number> = {
  "1": 1,
  "2": 2,
  "3": 50,
  "4": 77,
  "5": 106,
  "6": 128,
  "7": 151,
  "8": 177,
  "9": 187,
  "10": 208,
  "11": 221,
  "12": 235,
  "13": 249,
  "14": 255,
  "15": 262,
  "16": 267,
  "17": 282,
  "18": 293,
  "19": 305,
  "20": 312,
  "21": 322,
  "22": 332,
  "23": 342,
  "24": 350,
  "25": 359,
  "26": 367,
  "27": 377,
  "28": 385,
  "29": 396,
  "30": 404,
  "31": 411,
  "32": 415,
  "33": 418,
  "34": 428,
  "35": 434,
  "36": 440,
  "37": 446,
  "38": 453,
  "39": 458,
  "40": 467,
  "41": 477,
  "42": 483,
  "43": 489,
  "44": 496,
  "45": 499,
  "46": 502,
  "47": 507,
  "48": 511,
  "49": 515,
  "50": 518,
  "51": 520,
  "52": 523,
  "53": 526,
  "54": 528,
  "55": 531,
  "56": 534,
  "57": 537,
  "58": 542,
  "59": 545,
  "60": 549,
  "61": 551,
  "62": 553,
  "63": 554,
  "64": 556,
  "65": 558,
  "66": 560,
  "67": 562,
  "68": 564,
  "69": 566,
  "70": 568,
  "71": 570,
  "72": 572,
  "73": 574,
  "74": 575,
  "75": 577,
  "76": 578,
  "77": 580,
  "78": 582,
  "79": 583,
  "80": 585,
  "81": 586,
  "82": 587,
  "83": 587,
  "84": 589,
  "85": 590,
  "86": 591,
  "87": 591,
  "88": 592,
  "89": 593,
  "90": 594,
  "91": 595,
  "92": 595,
  "93": 596,
  "94": 596,
  "95": 597,
  "96": 597,
  "97": 598,
  "98": 598,
  "99": 599,
  "100": 599,
  "101": 600,
  "102": 600,
  "103": 601,
  "104": 601,
  "105": 601,
  "106": 602,
  "107": 602,
  "108": 602,
  "109": 603,
  "110": 603,
  "111": 603,
  "112": 604,
  "113": 604,
  "114": 604,
};

const toArabicDigits = (num: number | string) => {
  const id = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().replace(/[0-9]/g, (w) => id[+w]);
};

interface ThemeOption {
  id: "papyrus" | "scroll" | "twilight" | "olive";
  name: string;
  bg: string;
  text: string;
  cardBg: string;
  border: string;
  accent: string;
  highlight: string;
}

const THEMES: Record<string, ThemeOption> = {
  papyrus: {
    id: "papyrus",
    name: "القرطاس الدافئ",
    bg: "bg-[#f7f2ea]",
    text: "text-[#2b1a10]",
    cardBg: "bg-[#fdfcfb]",
    border: "border-[#e6dccf]",
    accent: "text-[#b88a4f]",
    highlight: "bg-[#b88a4f]/10",
  },
  scroll: {
    id: "scroll",
    name: "السجل الأبيض",
    bg: "bg-[#fafafa]",
    text: "text-[#1c1917]",
    cardBg: "bg-[#ffffff]",
    border: "border-[#e7e5e4]",
    accent: "text-[#78716c]",
    highlight: "bg-[#78716c]/8",
  },
  twilight: {
    id: "twilight",
    name: "الغسق الهادئ",
    bg: "bg-[#181412]",
    text: "text-[#ece7de]",
    cardBg: "bg-[#251e1a]",
    border: "border-[#3a3029]",
    accent: "text-[#deab65]",
    highlight: "bg-[#deab65]/15",
  },
  olive: {
    id: "olive",
    name: "الزيتوني العتيق",
    bg: "bg-[#edf1eb]",
    text: "text-[#1d271a]",
    cardBg: "bg-[#f5f7f3]",
    border: "border-[#dae2d7]",
    accent: "text-[#4d6342]",
    highlight: "bg-[#4d6342]/10",
  },
};

const quranDictionary: Record<string, string> = {
  ٱللَّهِ: "لفظ الجلالة، المألوه المعبود بحق",
  ٱلرَّحْمَٰنِ: "ذو الرحمة الواسعة",
  ٱلرَّحِيمِ: "ذو الرحمة الواصلة للمؤمنين",
};

const MOCK_RECITERS = [
  { id: 1, name: "مشاري راشد العفاسي" },
  { id: 2, name: "عبد الباسط عبد الصمد" },
  { id: 3, name: "محمود خليل الحصري" },
  { id: 4, name: "ياسر الدوسري" },
];

interface Props {
  surahId: number;
  onClose: () => void;
  onPlayAudio?: (surahId: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  initialPage?: number;
}

export default function QuranReaderScreen({
  surahId,
  onClose,
  onPlayAudio,
  isPlaying: externalIsPlaying,
  onTogglePlay,
  initialPage,
}: Props) {
  const [currentPage, setCurrentPage] = useState<number>(
    initialPage || SURAH_START_PAGES[surahId] || 1,
  );
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev">(
    "next",
  );

  const pageVariants = {
    initial: (dir: "next" | "prev") => ({
      opacity: 0,
      x: dir === "next" ? -60 : 60,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir: "next" | "prev") => ({
      opacity: 0,
      x: dir === "next" ? 60 : -60,
      scale: 0.98,
    }),
  };

  const pageTransition = {
    type: "spring",
    stiffness: 400,
    damping: 38,
    mass: 1,
  };
  const [pageVerses, setPageVerses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Controls & Modals
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showActionCard, setShowActionCard] = useState(false);
  const [actionCardPosition, setActionCardPosition] = useState({
    top: 0,
    left: 0,
  });
  const [selectedVerseForAction, setSelectedVerseForAction] =
    useState<any>(null);
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    meaning: string;
    x: number;
    y: number;
  } | null>(null);

  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirContent, setTafsirContent] = useState<any>(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<"single" | "page" | "continuous">(
    "continuous",
  );
  const [repeatSettings, setRepeatSettings] = useState({
    count: 1,
    current: 0,
  });
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState<number>(1);

  const [reflectionVerse, setReflectionVerse] = useState<any>(null);

  // Bookmarking State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);

  // Theme
  const [themeId, setThemeId] = useState<
    "papyrus" | "scroll" | "twilight" | "olive"
  >(() => {
    try {
      const saved = localStorage.getItem("sakina_reader_theme") as any;
      return saved && THEMES[saved] ? saved : "papyrus";
    } catch {
      return "papyrus";
    }
  });

  const activeTheme = THEMES[themeId];

  const currentSurahId =
    pageVerses.length > 0 && pageVerses[0].chapter_id
      ? pageVerses[0].chapter_id
      : surahId;

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(
        localStorage.getItem("sakina_quran_bookmarks") || "[]",
      );
      const pageBookmarked = bookmarks.some(
        (b: any) => b.type === "page" && b.page === currentPage,
      );
      setIsBookmarked(pageBookmarked);
      const verses = bookmarks
        .filter((b: any) => b.type === "verse")
        .map((b: any) => b.verseKey);
      setBookmarkedVerses(verses);
    } catch (e) {
      console.error(e);
    }
  }, [currentPage]);

  const togglePageBookmark = () => {
    try {
      const bookmarks = JSON.parse(
        localStorage.getItem("sakina_quran_bookmarks") || "[]",
      );
      const isExist = bookmarks.some(
        (b: any) => b.type === "page" && b.page === currentPage,
      );
      let updated = [];
      if (isExist) {
        updated = bookmarks.filter(
          (b: any) => !(b.type === "page" && b.page === currentPage),
        );
        setIsBookmarked(false);
      } else {
        const newBookmark = {
          id: `page-${currentPage}`,
          type: "page",
          surahId: currentSurahId,
          surahName: surahNames[currentSurahId] || `سورة ${currentSurahId}`,
          page: currentPage,
          timestamp: Date.now(),
        };
        updated = [newBookmark, ...bookmarks];
        setIsBookmarked(true);
      }
      localStorage.setItem("sakina_quran_bookmarks", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleVerseBookmark = (verse: any) => {
    try {
      const bookmarks = JSON.parse(
        localStorage.getItem("sakina_quran_bookmarks") || "[]",
      );
      const isExist = bookmarks.some(
        (b: any) => b.type === "verse" && b.verseKey === verse.verse_key,
      );
      let updated = [];
      if (isExist) {
        updated = bookmarks.filter(
          (b: any) => !(b.type === "verse" && b.verseKey === verse.verse_key),
        );
        setBookmarkedVerses((prev) =>
          prev.filter((k) => k !== verse.verse_key),
        );
      } else {
        const newBookmark = {
          id: `verse-${verse.verse_key}`,
          type: "verse",
          surahId: verse.chapter_id,
          surahName: surahNames[verse.chapter_id] || `سورة ${verse.chapter_id}`,
          verseNumber: verse.verse_number,
          verseKey: verse.verse_key,
          page: currentPage,
          timestamp: Date.now(),
        };
        updated = [newBookmark, ...bookmarks];
        setBookmarkedVerses((prev) => [...prev, verse.verse_key]);
      }
      localStorage.setItem("sakina_quran_bookmarks", JSON.stringify(updated));
      setShowActionCard(false);
    } catch (e) {
      console.error(e);
    }
  };
  const startPage = SURAH_START_PAGES[currentSurahId] || 1;
  const endPage =
    currentSurahId < 114 ? SURAH_START_PAGES[currentSurahId + 1] - 1 : 604;
  const totalPages = endPage - startPage + 1;
  const clampedPage = Math.max(startPage, Math.min(endPage, currentPage));
  const pagesRemaining = endPage - clampedPage;
  const remainingPercent =
    totalPages > 1 ? Math.round((pagesRemaining / (totalPages - 1)) * 100) : 0;
  const completionPercent = 100 - remainingPercent;

  useEffect(() => {
    try {
      localStorage.setItem("sakina_reader_theme", themeId);
    } catch {}
  }, [themeId]);

  // Load verses for the current page
  useEffect(() => {
    let isMounted = true;

    const fetchPageData = async () => {
      setIsLoading(true);
      setPageVerses([]);

      try {
        // MOCK DATA for UI Template
        const verses = Array.from({ length: 5 }).map((_, i) => ({
          id: `v-${i}`,
          chapter_id: currentSurahId,
          verse_number: i + 1,
          verse_key: `${currentSurahId}:${i + 1}`,
          text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          juz_number: 1,
        }));
        await new Promise(r => setTimeout(r, 300));

        if (!isMounted) return;
        if (verses && verses.length > 0) {
          setPageVerses(verses);
        }
      } catch (err: any) {
        console.error("Error loading offline Quran Page:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPageData();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  // Swipe logic
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchEndX.current = e.changedTouches[0].screenX; // Reset to prevent stale swipe calculation on simple taps
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const onTouchEnd = () => {
    const diff = touchEndX.current - touchStartX.current;
    if (diff > 80 && currentPage < 604) {
      setAnimationDirection("next");
      setCurrentPage(currentPage + 1); // Swipe right -> Next page (RTL)
    } else if (diff < -80 && currentPage > 1) {
      setAnimationDirection("prev");
      setCurrentPage(currentPage - 1); // Swipe left -> Previous page (RTL)
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Verse interaction
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const handleVerseTouchStart = (
    verse: any,
    e: React.TouchEvent | React.MouseEvent,
  ) => {
    touchTimer.current = setTimeout(() => {
      setSelectedVerseForAction(verse);
      setShowActionCard(true);
    }, 500);
  };

  const handleVerseTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  // Actions
  const handleShowTafsirForSelected = async () => {
    if (!selectedVerseForAction) return;
    setShowActionCard(false);
    setShowTafsir(true);
    setTafsirLoading(true);
    try {
      // MOCK DATA
      await new Promise(r => setTimeout(r, 500));
      const tafsirPage = [{ verse_key: selectedVerseForAction.verse_key, text: "تفسير توضيحي للآية الكريمة بناءً على المصادر المعتمدة." }];
      if (tafsirPage && tafsirPage.length > 0) {
        const verseTafsir = tafsirPage.find(
          (t: any) => t.verse_key === selectedVerseForAction.verse_key,
        );
        if (verseTafsir) {
          setTafsirContent({
            text: verseTafsir.text.replace(/<\/?[^>]+(>|$)/g, ""),
          });
        } else {
          setTafsirContent({
            text: "عذراً، التفسير لهذه الآية غير متوفر حالياً.",
          });
        }
      } else {
        setTafsirContent({
          text: "برجاء إعادة تحميل المصحف للحصول على بيانات التفسير الموثوقة.",
        });
      }
    } catch (e) {
      console.error(e);
      setTafsirContent({ text: "حدث خطأ أثناء جلب التفسير." });
    } finally {
      setTafsirLoading(false);
    }
  };

  const handlePlaySelectedVerse = () => {
    setIsPlaying(true);
    setPlayingVerseKey(selectedVerseForAction.verse_key);
    setShowActionCard(false);
  };

  const handleCopyVerse = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowActionCard(false);
  };

  const handleShowReflectionCard = () => {
    setReflectionVerse(selectedVerseForAction);
    setShowActionCard(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Dynamic layout
  const dynamicStyle = useMemo(() => {
    if (pageVerses.length === 0) return {};
    const totalChars = pageVerses.reduce(
      (acc, v) => acc + v.text_uthmani.length,
      0,
    );

    let vw = 4.8;
    let vh = 2.6;

    if (totalChars > 2200) {
      vw = 3.0;
      vh = 1.7;
    } else if (totalChars > 1800) {
      vw = 3.3;
      vh = 1.9;
    } else if (totalChars > 1300) {
      vw = 3.6;
      vh = 2.0;
    } else if (totalChars > 900) {
      vw = 3.9;
      vh = 2.2;
    }

    return {
      textAlign: "justify" as const,
      textAlignLast: "center" as const,
      fontSize: `min(${vw}vw, ${vh}vh)`,
      lineHeight: "calc(70vh / 15)",
      direction: "rtl" as const,
      fontFamily: "'KFGQPC Uthman Taha Naskh', serif",
    };
  }, [pageVerses]);

  return (
    <motion.div
      key="quran-reader-screen"
      initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 w-full h-[100vh] overflow-hidden flex flex-col justify-center px-6 sm:px-10 transition-colors duration-500 ${activeTheme.bg} ${activeTheme.text}`}
      dir="rtl"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={() => {
        setShowControls(!showControls);
        setShowActionCard(false);
        setSelectedVerseForAction(null);
      }}
    >
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => {
          console.error("Audio playback error");
          setIsPlaying(false);
        }}
        className="hidden"
      />

      {/* Content Area */}
      <div
        className={`flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center overflow-hidden relative`}
      >
        {/* Integrated Header Info - Fixed Position */}
        <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-8 font-bold text-[10px] sm:text-xs opacity-50 pointer-events-none font-cairo">
          <span>
            الجُزْءُ{" "}
            {pageVerses.length > 0
              ? toArabicDigits(pageVerses[0].juz_number)
              : ""}
          </span>
          <span>
            {pageVerses.length > 0
              ? `سُورَةُ ${surahNames[pageVerses[0].chapter_id]}`
              : ""}
          </span>
        </div>

        {/* Progress Indicator Capsule */}
        {!isLoading && pageVerses.length > 0 && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
            <div
              className={`px-4 py-1.5 rounded-full border flex items-center gap-3 backdrop-blur-md shadow-sm ${activeTheme.cardBg}/40 ${activeTheme.border}`}
            >
              <span className="text-[10px] font-bold tracking-wide whitespace-nowrap opacity-80 font-cairo">
                المتبقي من سورة {surahNames[currentSurahId]}:{" "}
                {toArabicDigits(remainingPercent)}٪
              </span>
              <div className="w-16 h-1 rounded-full bg-current/10 overflow-hidden relative">
                <motion.div
                  className={`absolute right-0 top-0 bottom-0 h-full rounded-full ${activeTheme.accent.replace("text-", "bg-")}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Integrated Page Number - Fixed Position */}
        <div className="absolute bottom-6 left-8 flex justify-center items-center font-bold text-xs sm:text-sm opacity-80 pointer-events-none font-cairo">
          {toArabicDigits(currentPage)}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center h-full"
            >
              <Loader2
                className={`animate-spin ${activeTheme.accent}`}
                size={40}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentPage}
              custom={animationDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full h-full flex flex-col justify-center overflow-hidden py-24 sm:py-28"
            >
              <div
                className="w-full select-none"
                onContextMenu={(e) => e.preventDefault()}
                style={dynamicStyle}
              >
                {pageVerses.map((verse, index) => {
                  const isSurahStart = verse.verse_number === 1;
                  const isSelected = selectedVerseForAction?.id === verse.id;

                  const words = verse.text_uthmani.split(" ");

                  return (
                    <React.Fragment key={verse.id}>
                      {isSurahStart && (
                        <div
                          className="w-full flex flex-col items-center block"
                          style={{
                            textAlign: "center",
                            textAlignLast: "center",
                          }}
                        >
                          {/* Surah Title Frame */}
                          <div className="w-full max-w-[380px] sm:max-w-[460px] md:max-w-[500px] aspect-[1376/768] relative flex justify-center items-center mx-auto mb-4 select-none">
                            <img
                              src="/images/islamic_surah_frame_1783125338370.jpg"
                              alt="Surah Frame"
                              loading="eager"
                              className={`absolute inset-0 w-full h-full object-fill pointer-events-none transition-all duration-300 ${
                                themeId === "twilight"
                                  ? "invert brightness-95 contrast-125 opacity-85"
                                  : "mix-blend-multiply opacity-95"
                              }`}
                            />
                            <span
                              className={`relative z-10 text-xl sm:text-2xl md:text-3xl font-bold font-cairo ${activeTheme.accent} tracking-wide select-none pb-0.5`}
                            >
                              سُورَةُ {surahNames[verse.chapter_id]}
                            </span>
                          </div>
                          {/* Bismillah */}
                          {verse.chapter_id !== 9 && verse.chapter_id !== 1 && (
                            <div className="w-full flex justify-center items-center mb-[0.5vh]">
                              <span className="text-lg sm:text-2xl opacity-90 font-quran">
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <span
                        id={`verse-${verse.verse_key}`}
                        className={`transition-all duration-300 rounded-md px-0.5 inline ${
                          isSelected
                            ? activeTheme.highlight
                            : playingVerseKey === verse.verse_key
                              ? activeTheme.accent
                              : `hover:opacity-70 ${activeTheme.text}`
                        }`}
                        onTouchStart={(e) => handleVerseTouchStart(verse, e)}
                        onTouchEnd={handleVerseTouchEnd}
                        onMouseDown={(e) => handleVerseTouchStart(verse, e)}
                        onMouseUp={handleVerseTouchEnd}
                        onMouseLeave={handleVerseTouchEnd}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {words.map((word: string, wIdx: number) => {
                          const cleanWord = word.trim();
                          let meaning = quranDictionary[cleanWord];

                          if (!meaning) {
                            const prefixes = [
                              "و",
                              "ف",
                              "ل",
                              "ب",
                              "ك",
                              "ال",
                              "وال",
                              "فال",
                            ];
                            for (const prefix of prefixes) {
                              if (cleanWord.startsWith(prefix)) {
                                const stemmed = cleanWord.slice(prefix.length);
                                if (quranDictionary[stemmed]) {
                                  meaning = quranDictionary[stemmed];
                                  break;
                                }
                              }
                            }
                          }

                          return (
                            <span
                              key={wIdx}
                              className={`inline-block cursor-pointer hover:opacity-80 ${meaning ? "border-b border-dotted border-current" : ""}`}
                              onClick={(e) => {
                                if (meaning) {
                                  e.stopPropagation();
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  setSelectedWord({
                                    word: cleanWord,
                                    meaning: meaning,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top,
                                  });
                                  setTimeout(() => setSelectedWord(null), 3000);
                                }
                              }}
                            >
                              {word}{" "}
                            </span>
                          );
                        })}
                      </span>
                      <span
                        className="inline-flex items-center justify-center relative mx-1 align-middle opacity-80"
                        style={{ width: "3.2vh", height: "3.2vh" }}
                      >
                        <svg
                          viewBox="0 0 100 100"
                          className={`absolute inset-0 w-full h-full ${activeTheme.accent}`}
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M50 10 M10 50 A 40 40 0 1 0 90 50 A 40 40 0 1 0 10 50 Z"
                            stroke="currentColor"
                            strokeWidth="5"
                          />
                        </svg>
                        <span className="relative z-10 font-cairo font-bold text-[1.4vh] mt-[-1px]">
                          {toArabicDigits(verse.verse_key.split(":")[1])}
                        </span>
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dictionary Popover */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`fixed z-[80] px-4 py-2 rounded-xl shadow-xl backdrop-blur-xl border pointer-events-none ${activeTheme.cardBg} ${activeTheme.border} ${activeTheme.text}`}
            style={{
              top: selectedWord.y - 10,
              left: selectedWord.x,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="text-center font-cairo">
              <div
                className={`font-bold text-sm mb-1 ${activeTheme.accent}`}
                style={{ fontFamily: "'KFGQPC Uthman Taha Naskh', serif" }}
              >
                {selectedWord.word}
              </div>
              <div className="text-xs font-medium">{selectedWord.meaning}</div>
            </div>
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 border-b border-r ${activeTheme.cardBg} ${activeTheme.border}`}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Card for Selected Verse */}
      <AnimatePresence>
        {showActionCard && selectedVerseForAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className={`fixed z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-xl border ${activeTheme.cardBg} ${activeTheme.border}`}
            style={{
              bottom: "5.5rem",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onClick={(e) => e.stopPropagation()}
            dir="ltr"
          >
            <button
              onClick={handlePlaySelectedVerse}
              className={`p-2 rounded-full transition-colors hover:opacity-70 ${activeTheme.accent}`}
              title="تلاوة"
            >
              <Play size={18} fill="currentColor" />
            </button>
            <div className={`w-px h-5 ${activeTheme.border} border-l`}></div>
            <button
              onClick={handleShowTafsirForSelected}
              className={`p-2 rounded-full transition-colors hover:opacity-70 ${activeTheme.text}`}
              title="تفسير"
            >
              <BookOpen size={18} />
            </button>
            <div className={`w-px h-5 ${activeTheme.border} border-l`}></div>
            <button
              onClick={handleShowReflectionCard}
              className={`p-2 rounded-full transition-colors hover:opacity-70 ${activeTheme.text}`}
              title="بطاقة تدبر"
            >
              <ImageIcon size={18} />
            </button>
            <div className={`w-px h-5 ${activeTheme.border} border-l`}></div>
            <button
              onClick={() =>
                handleCopyVerse(selectedVerseForAction.text_uthmani)
              }
              className={`p-2 rounded-full transition-colors hover:opacity-70 ${activeTheme.text}`}
              title="نسخ"
            >
              <Copy size={18} />
            </button>
            <div className={`w-px h-5 ${activeTheme.border} border-l`}></div>
            <button
              onClick={() => toggleVerseBookmark(selectedVerseForAction)}
              className={`p-2 rounded-full transition-colors hover:opacity-70 ${bookmarkedVerses.includes(selectedVerseForAction.verse_key) ? activeTheme.accent : activeTheme.text}`}
              title="حفظ العلامة المرجعية"
            >
              <Bookmark
                size={18}
                fill={
                  bookmarkedVerses.includes(selectedVerseForAction.verse_key)
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Player Sheet */}
      <AnimatePresence>
        {isPlaying && playMode === "single" && !showReciterModal && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] rounded-full shadow-2xl border backdrop-blur-xl px-6 py-3 flex items-center gap-6 ${activeTheme.cardBg} ${activeTheme.border}`}
            onClick={(e) => e.stopPropagation()}
            dir="ltr"
          >
            {/* Reciter Button */}
            <button
              onClick={() => setShowReciterModal(true)}
              className={`flex items-center gap-1.5 transition-colors hover:opacity-70 ${activeTheme.text}`}
              title="القارئ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </button>

            <div className={`w-px h-6 border-l ${activeTheme.border}`}></div>

            {/* Stop Button */}
            <button
              onClick={() => {
                audioRef.current?.pause();
                setIsPlaying(false);
                setPlayingVerseKey(null);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 bg-red-500 hover:bg-red-600`}
            >
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </button>

            <div className={`w-px h-6 border-l ${activeTheme.border}`}></div>

            {/* Settings Button */}
            <button
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              className={`flex items-center gap-1.5 transition-colors hover:opacity-70 ${playMode !== "continuous" ? activeTheme.accent : activeTheme.text}`}
              title="إعدادات التكرار"
            >
              <div className="relative">
                <Settings size={22} />
                {playMode !== "continuous" && (
                  <span
                    className={`absolute -top-1.5 -right-1.5 text-[9px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border border-white ${activeTheme.accent.replace("text-", "bg-")}`}
                  >
                    {repeatSettings.count}
                  </span>
                )}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Settings Modal */}
      <AnimatePresence>
        {showAudioSettings && isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] w-72 p-5 rounded-2xl shadow-2xl border backdrop-blur-xl ${activeTheme.cardBg} ${activeTheme.border} ${activeTheme.text} font-cairo`}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">إعدادات التكرار</h3>
              <button
                onClick={() => setShowAudioSettings(false)}
                className="p-1 hover:opacity-70 rounded-full"
              >
                <X size={16} className="opacity-50" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Play Mode */}
              <div>
                <label className="text-xs font-bold mb-2 block opacity-70">
                  نطاق التكرار
                </label>
                <div
                  className={`flex rounded-xl p-1 gap-1 border ${activeTheme.border} bg-black/5`}
                >
                  <button
                    onClick={() => setPlayMode("single")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${playMode === "single" ? `${activeTheme.accent.replace("text-", "bg-")} text-white shadow-md` : "hover:opacity-70 opacity-70"}`}
                  >
                    آية واحدة
                  </button>
                  <button
                    onClick={() => setPlayMode("page")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${playMode === "page" ? `${activeTheme.accent.replace("text-", "bg-")} text-white shadow-md` : "hover:opacity-70 opacity-70"}`}
                  >
                    صفحة كاملة
                  </button>
                  <button
                    onClick={() => setPlayMode("continuous")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${playMode === "continuous" ? `${activeTheme.accent.replace("text-", "bg-")} text-white shadow-md` : "hover:opacity-70 opacity-70"}`}
                  >
                    مستمر
                  </button>
                </div>
              </div>

              {/* Repeat Count */}
              {playMode !== "continuous" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold opacity-70">
                      عدد التكرار
                    </label>
                    <span className={`text-xs font-bold ${activeTheme.accent}`}>
                      {repeatSettings.count === 10 ? "∞" : repeatSettings.count}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={repeatSettings.count}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setRepeatSettings((prev) => ({ ...prev, count: val }));
                    }}
                    className={`w-full ${activeTheme.accent.replace("text-", "accent-")} h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer`}
                  />
                  <div className="flex justify-between text-[10px] opacity-40 mt-2 font-mono">
                    <span>1</span>
                    <span>3</span>
                    <span>5</span>
                    <span>∞</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controls */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Exit Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-2xl flex items-center justify-center cut-crystal-capsule shadow-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
            >
              <LogOut size={20} className="rotate-180 text-[#2b1a10]" />
            </motion.button>

            {/* Page Bookmark Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
              onClick={(e) => {
                e.stopPropagation();
                togglePageBookmark();
              }}
              className={`absolute top-6 left-6 z-50 w-10 h-10 rounded-2xl flex items-center justify-center cut-crystal-capsule shadow-lg transition-all duration-300 ${isBookmarked ? "text-[#b88a4f]" : "text-[#7f6a55]"} hover:opacity-80 cursor-pointer`}
              title="حفظ الصفحة الحالية"
            >
              <Bookmark
                size={18}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </motion.button>

            {/* Floating Control Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-5 px-6 py-3 rounded-full cut-crystal-capsule shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              dir="ltr"
            >
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-70 text-[#2b1a10] cursor-pointer"
                title="السمات والألوان"
              >
                <Palette size={20} />
              </button>

              <button
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 bg-[#b88a4f] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
              >
                {isPlaying && playMode === "continuous" ? (
                  <Pause size={22} fill="currentColor" />
                ) : (
                  <Play size={22} fill="currentColor" className="ml-1" />
                )}
              </button>

              <button
                onClick={() => setShowReciterModal(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-70 text-[#2b1a10] cursor-pointer"
                title="القارئ"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reciter Modal */}
      <AnimatePresence>
        {showReciterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowReciterModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[70vh] cut-crystal-panel text-[#2b1a10]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-5 border-b border-[#e6dccf]/60 text-center font-bold text-lg"
                style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
              >
                اختر القارئ
              </div>
              <div className="overflow-y-auto custom-scrollbar p-2 flex-1">
                {MOCK_RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedReciter(r.id);
                      setShowReciterModal(false);
                    }}
                    className={`w-full text-right px-4 py-3 rounded-xl mb-1 transition-colors flex items-center justify-between font-cairo ${selectedReciter === r.id ? "bg-[#b88a4f]/10 text-[#b88a4f]" : "hover:bg-[#e6dccf]/30"}`}
                  >
                    <span>{r.name}</span>
                    {selectedReciter === r.id && (
                      <div className="w-2 h-2 rounded-full bg-[#b88a4f]"></div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal (Theme) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] w-72 p-5 rounded-2xl shadow-2xl cut-crystal-panel font-cairo"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-[#2b1a10]">
                المظهر والألوان
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:opacity-70 rounded-full cursor-pointer"
              >
                <X size={16} className="text-[#2b1a10]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              {Object.values(THEMES).map((t) => {
                const isSel = themeId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center cursor-pointer ${
                      isSel
                        ? "border-[#b88a4f] bg-[#b88a4f]/10 text-[#b88a4f]"
                        : "border-[#e6dccf] opacity-70 hover:bg-[#e6dccf]/20"
                    } active:scale-95`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${t.bg} border border-[#e6dccf] mb-2 shadow-inner`}
                    ></div>
                    <span className="text-[12px] font-bold">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tafsir Modal */}
      <AnimatePresence>
        {showTafsir && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <div
              className={`w-full max-w-lg h-[60vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto border ${activeTheme.cardBg} ${activeTheme.border} font-cairo`}
            >
              <div
                className={`flex justify-between items-center p-4 border-b ${activeTheme.border}`}
              >
                <h3
                  className={`font-bold flex items-center gap-2 ${activeTheme.accent}`}
                >
                  <BookOpen size={18} />
                  <span>تفسير الآية</span>
                </h3>
                <button
                  onClick={() => setShowTafsir(false)}
                  className="p-1 hover:opacity-70 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {tafsirLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2
                      className={`animate-spin ${activeTheme.accent}`}
                      size={32}
                    />
                  </div>
                ) : (
                  <div className="text-right" dir="rtl">
                    <p className="leading-loose text-sm sm:text-base font-serif opacity-90">
                      {tafsirContent?.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
