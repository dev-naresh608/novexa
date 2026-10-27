import React from "react";
import { Volume2, VolumeX, X, Lightbulb } from "lucide-react";

export const MascotSpeechBubble = ({
  message,
  mood,
  isSoundOn,
  onToggleSound,
  onClose,
  onNextTip,
  isSleeping,
  align = "right",
  direction = "up",
  style = {},
}) => {
  if (!message) return null;

  const moodBadges = {
    idle: { label: "Ready", color: "bg-blue-50 text-blue-700 border-blue-200" },
    waking: { label: "Waking up", color: "bg-amber-50 text-amber-700 border-amber-200" },
    sleeping: { label: "Zzz... Sleeping", color: "bg-purple-50 text-purple-700 border-purple-200" },
    drowsy: { label: "Sleepy", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    excited: { label: "Excited! ✨", color: "bg-amber-50 text-amber-700 border-amber-200" },
    celebrate: { label: "Hooray! 🎉", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    laughing: { label: "Haha! 😄", color: "bg-pink-50 text-pink-700 border-pink-200" },
    playful: { label: "Playful 🎈", color: "bg-orange-50 text-orange-700 border-orange-200" },
    thinking: { label: "Thinking... 💭", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    confused: { label: "Confused? 🤔", color: "bg-rose-50 text-rose-700 border-rose-200" },
    curious: { label: "Curious 👀", color: "bg-violet-50 text-violet-700 border-violet-200" },
    proud: { label: "Proud 🌟", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    angry: { label: "Angry! 😡", color: "bg-red-50 text-red-700 border-red-200" },
  };

  const badge = moodBadges[mood] || {
    label: mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : "Guide",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={style}
      className="fixed z-[100] w-64 sm:w-72 max-w-[calc(100vw-20px)] rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-indigo-100/80 transition-all duration-300 ease-out animate-in fade-in select-none pointer-events-auto"
    >
      {/* Speech bubble pointer / triangle tail pointing towards Novie */}
      <div
        className={`absolute w-3.5 h-3.5 bg-white transform rotate-45 shadow-xs pointer-events-none ${
          direction === "up"
            ? "-bottom-1.5 border-r border-b border-indigo-100/80"
            : "-top-1.5 border-l border-t border-indigo-100/80"
        } ${
          align === "left"
            ? "left-6 sm:left-8"
            : "right-6 sm:right-8"
        }`}
        aria-hidden="true"
      />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-1 pb-2 mb-2 border-b border-gray-100 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Novie</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={isSoundOn ? "Mute sounds" : "Enable sounds"}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label={isSoundOn ? "Mute sounds" : "Enable sounds"}
          >
            {isSoundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={onClose}
            title="Dismiss tip"
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close speech bubble"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Body message */}
      <p className="text-xs leading-relaxed text-gray-700 font-medium">
        {message}
      </p>

      {/* Bottom actions: Next Tip button if not sleeping */}
      {!isSleeping && onNextTip && (
        <div className="mt-2.5 pt-2 border-t border-gray-100/80 flex items-center justify-between text-[11px]">
          <span className="text-gray-400 font-normal">Tap Novie for fun!</span>
          <button
            type="button"
            onClick={onNextTip}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline cursor-pointer"
          >
            <Lightbulb size={12} />
            <span>Next Tip</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MascotSpeechBubble;
