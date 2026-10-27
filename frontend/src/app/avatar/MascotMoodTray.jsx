import React from "react";
import { X, RotateCcw, Sparkles } from "lucide-react";
import { AVATAR_ANIMATIONS } from "./avatar";

const MOOD_EMOJIS = {
  idle: "💫",
  waking: "🌅",
  sleeping: "😴",
  drowsy: "😪",
  excited: "🤩",
  celebrate: "🎉",
  happy: "😊",
  laughing: "😂",
  playful: "🎈",
  curious: "🧐",
  thinking: "💭",
  searching: "🔍",
  working: "⚙️",
  proud: "🌟",
  confused: "🤨",
  suspicious: "👀",
  surprised: "😲",
  shy: "🫣",
  sad: "🥺",
  scared: "😨",
  angry: "😡",
  bored: "🥱",
  listening: "👂",
};

export const MascotMoodTray = ({
  currentMood,
  onSelectMood,
  onReset,
  onClose,
  align = "right",
  direction = "up",
  style = {},
}) => {
  return (
    <div
      role="dialog"
      aria-label="Novie Mood Playground"
      style={style}
      className="fixed z-[100] w-72 sm:w-80 max-w-[calc(100vw-20px)] rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl border border-indigo-200/80 animate-in fade-in zoom-in-95 duration-200 select-none text-gray-800 flex flex-col pointer-events-auto"
    >
      {/* Pointer tail aligned to mascot */}
      <div
        className={`absolute w-3.5 h-3.5 bg-white transform rotate-45 shadow-xs pointer-events-none ${
          direction === "up"
            ? "-bottom-1.5 border-r border-b border-indigo-200/80"
            : "-top-1.5 border-l border-t border-indigo-200/80"
        } ${
          align === "left"
            ? "left-6 sm:left-8"
            : "right-6 sm:right-8"
        }`}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900">
          <Sparkles size={16} className="text-indigo-600 animate-spin" />
          <span>Mood Playground</span>
          <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            23 Animations
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close Mood Playground"
        >
          <X size={15} />
        </button>
      </div>

      <p className="text-[11px] text-gray-500 mb-2 shrink-0">
        Click any mood to watch Novie act in real-time:
      </p>

      {/* Grid of moods (Scrollable middle section) */}
      <div className="overflow-y-auto pr-1 grid grid-cols-2 gap-1.5 text-xs scrollbar-thin flex-1 min-h-0">
        {AVATAR_ANIMATIONS.map((mood) => {
          const isActive = currentMood === mood;
          const emoji = MOOD_EMOJIS[mood] || "✨";
          return (
            <button
              key={mood}
              type="button"
              onClick={() => onSelectMood(mood)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-medium text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]"
                  : "bg-gray-50/80 hover:bg-indigo-50/70 border-gray-200/70 text-gray-700 hover:border-indigo-200 hover:text-indigo-700"
              }`}
            >
              <span className="text-sm">{emoji}</span>
              <span className="capitalize text-[11px] truncate">{mood}</span>
            </button>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between shrink-0">
        <span className="text-[11px] text-gray-500">
          Active: <strong className="text-indigo-600 capitalize">{currentMood}</strong>
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Reset Idle</span>
        </button>
      </div>
    </div>
  );
};

export default MascotMoodTray;
