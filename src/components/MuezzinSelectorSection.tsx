import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Play,
  Pause,
  Download,
  Check,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { MuezzinTrack } from "../types/prayer-settings";

// Temporary placeholder list for design/preview purposes
const MUEZZINS_LIST: MuezzinTrack[] = [
  {
    id: "ali_mulla",
    name: "علي أحمد ملا",
    url: "https://archive.org/download/SakeenahAzan/ali_mulla.mp3",
    fileName: "ali_mulla_azan.mp3",
  },
  {
    id: "deghreri",
    name: "حمد بن أحمد الدغريري",
    url: "https://archive.org/download/SakeenahAzan/deghreri.mp3",
    fileName: "deghreri_azan.mp3",
  },
  {
    id: "basnawi",
    name: "أحمد عبد الله بصنوي",
    url: "https://archive.org/download/SakeenahAzan/basnawi.mp3",
    fileName: "basnawi_azan.mp3",
  },
  {
    id: "shaker",
    name: "محمد علي شاكر",
    url: "https://archive.org/download/SakeenahAzan/shaker.mp3",
    fileName: "shaker_azan.mp3",
  },
  {
    id: "khoj",
    name: "توفيق خوج",
    url: "https://archive.org/download/SakeenahAzan/khoj.mp3",
    fileName: "khoj_azan.mp3",
  },
  {
    id: "fayda",
    name: "نايف فيده",
    url: "https://archive.org/download/SakeenahAzan/fayda.mp3",
    fileName: "fayda_azan.mp3",
  },
  {
    id: "nahas",
    name: "أحمد نحاس",
    url: "https://archive.org/download/SakeenahAzan/nahas.mp3",
    fileName: "nahas_azan.mp3",
  },
  {
    id: "abbas",
    name: "ماجد العباس",
    url: "https://archive.org/download/SakeenahAzan/abbas.mp3",
    fileName: "abbas_azan.mp3",
  },
  {
    id: "khoja",
    name: "أحمد يونس خوجه",
    url: "https://archive.org/download/SakeenahAzan/khoja.mp3",
    fileName: "khoja_azan.mp3",
  },
  {
    id: "rayes",
    name: "سامي عبدالرحيم ريس",
    url: "https://archive.org/download/SakeenahAzan/rayes.mp3",
    fileName: "rayes_azan.mp3",
  },
  {
    id: "baqari",
    name: "عماد بقري",
    url: "https://archive.org/download/SakeenahAzan/baqari.mp3",
    fileName: "baqari_azan.mp3",
  },
  {
    id: "falatah",
    name: "سعيد عمر فلاته",
    url: "https://archive.org/download/SakeenahAzan/falatah.mp3",
    fileName: "falatah_azan.mp3",
  },
  {
    id: "shahat",
    name: "حسين شحات",
    url: "https://archive.org/download/SakeenahAzan/shahat.mp3",
    fileName: "shahat_azan.mp3",
  },
  {
    id: "omari",
    name: "محمد العمري",
    url: "https://archive.org/download/SakeenahAzan/omari.mp3",
    fileName: "omari_azan.mp3",
  },
  {
    id: "saqqaf",
    name: "هاشم السقاف",
    url: "https://archive.org/download/SakeenahAzan/saqqaf.mp3",
    fileName: "saqqaf_azan.mp3",
  },
];

interface MuezzinSelectorSectionProps {
  selectedMuezzinId?: string;
  onSelectMuezzin: (id: string) => void;
}

export const MuezzinSelectorSection = React.memo(
  function MuezzinSelectorSection({
    selectedMuezzinId,
    onSelectMuezzin,
  }: MuezzinSelectorSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>(
      {},
    );
    const [downloadingIds, setDownloadingIds] = useState<
      Record<string, boolean>
    >({});
    const [playingId, setPlayingId] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Clean up audio on unmount
    useEffect(() => {
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }, []);

    const handlePlayPreview = async (track: MuezzinTrack) => {
      try {
        // If clicking already playing track, pause it
        if (playingId === track.id) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setPlayingId(null);
          return;
        }

        // Stop previous audio if any
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(track.url);
        audioRef.current = audio;
        setPlayingId(track.id);

        audio.play().catch((err) => {
          console.warn("Failed to play preview:", err);
          setPlayingId(null);
        });

        audio.onended = () => {
          setPlayingId(null);
        };
      } catch (err) {
        console.warn("Error in playing preview:", err);
        setPlayingId(null);
      }
    };

    const handleDownload = async (track: MuezzinTrack, e: React.MouseEvent) => {
      e.stopPropagation(); // prevent row selection
      if (downloadingIds[track.id] || downloadedIds[track.id]) return;

      setDownloadingIds((prev) => ({ ...prev, [track.id]: true }));
      setTimeout(() => {
        setDownloadedIds((prev) => ({ ...prev, [track.id]: true }));
        setDownloadingIds((prev) => ({ ...prev, [track.id]: false }));
      }, 500);
    };

    const handleDelete = async (track: MuezzinTrack, e: React.MouseEvent) => {
      e.stopPropagation(); // prevent row selection
      if (confirm(`هل تريد حذف ملف الأذان لـ ${track.name}؟`)) {
        setDownloadedIds((prev) => ({ ...prev, [track.id]: false }));
      }
    };

    const filteredMuezzins = MUEZZINS_LIST.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

    return (
      <div className="space-y-4 transition-all duration-300 w-full pt-1">
        {/* Outer Section Title */}
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[13px] font-bold text-[#7f6a55] tracking-wide">
            صوت المؤذن
          </h4>
          <span className="text-[10.5px] font-bold text-[#b88a4f] bg-[#b88a4f]/10 px-2.5 py-0.5 rounded-full">
            {MUEZZINS_LIST.length} مؤذن
          </span>
        </div>

        {/* Elegant Capsule Search Input (matching Quran screen search bar design) */}
        <div className="relative flex items-center bg-[#fdfcfb]/95 backdrop-blur-xl border border-[#e6dccf]/70 rounded-[20px] h-12.5 shadow-[0_4px_20px_rgba(43,26,16,0.03)] px-3.5 w-full">
          <Search className="text-[#b88a4f] ml-2.5 shrink-0" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث عن مؤذن..."
            className="flex-1 h-full bg-transparent border-none outline-none text-[14px] font-sans font-bold text-[#2b1a10] placeholder:text-[#7f6a55]/65 pt-0.5 text-right"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[#7f6a55]/60 hover:text-[#2b1a10] transition-colors p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Muezzin List of Independent Capsule Cards */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 pb-1 hide-scrollbar">
          {filteredMuezzins.length === 0 ? (
            <p className="text-center text-[12px] font-bold text-[#7f6a55]/60 py-4">
              لا يوجد نتائج تطابق بحثك
            </p>
          ) : (
            filteredMuezzins.map((track) => {
              const isSelected = selectedMuezzinId === track.id;
              const isDownloaded = downloadedIds[track.id];
              const isDownloading = downloadingIds[track.id];
              const isPlaying = playingId === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => onSelectMuezzin(track.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-[22px] border backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? "bg-[#b88a4f]/10 border-[#b88a4f] shadow-[0_4px_16px_rgba(184,138,79,0.08)]"
                      : "bg-white/70 hover:bg-white border-white hover:border-[#b88a4f]/30 shadow-[0_2px_12px_rgba(43,26,16,0.02)]"
                  }`}
                >
                  {/* Right: Muezzin Name & active golden radio checkmark */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#b88a4f] bg-[#b88a4f]"
                          : "border-[#e6dccf] bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check size={10} className="text-white stroke-[3px]" />
                      )}
                    </div>
                    <span
                      className={`text-[13.5px] font-bold text-right transition-colors ${
                        isSelected ? "text-[#b88a4f]" : "text-[#2b1a10]"
                      }`}
                    >
                      {track.name}
                    </span>
                  </div>

                  {/* Left: Actions (Preview & Download/Delete) */}
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Play / Pause button */}
                    <button
                      type="button"
                      onClick={() => handlePlayPreview(track)}
                      className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all border ${
                        isPlaying
                          ? "bg-[#b88a4f] text-white border-[#b88a4f]"
                          : "bg-white text-[#2b1a10] border-[#e6dccf] hover:bg-[#f7f2ea]"
                      }`}
                      title={isPlaying ? "إيقاف الاستماع" : "استماع تجريبي"}
                    >
                      {isPlaying ? (
                        <Pause size={13} className="fill-current" />
                      ) : (
                        <Play size={13} className="fill-current mr-[-1px]" />
                      )}
                    </button>

                    {/* Download / Delete icon */}
                    {isDownloading ? (
                      <div className="w-8.5 h-8.5 rounded-full bg-[#f7f2ea] flex items-center justify-center text-[#b88a4f] border border-[#e6dccf]">
                        <Loader2 size={13} className="animate-spin" />
                      </div>
                    ) : isDownloaded ? (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(track, e)}
                        className="w-8.5 h-8.5 rounded-full bg-[#f7f2ea] hover:bg-rose-50 text-rose-500 hover:text-rose-600 flex items-center justify-center border border-[#e6dccf] transition-colors"
                        title="حذف الملف المحفوظ"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleDownload(track, e)}
                        className="w-8.5 h-8.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#7f6a55] flex items-center justify-center border border-[#e6dccf] transition-colors"
                        title="حفظ للاستخدام دون إنترنت"
                      >
                        <Download size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  },
);
