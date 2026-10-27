import { createAvatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import definition from "./strobi.avatar.json";
import { useCallback } from "react";

// Procedural 3D SVG Avatar component tied to the Novie mascot definition
export const Avatar = createAvatar(definition);
export const avatarDefinition = definition;

// All 23 ready animations extracted directly from Novie's definition
export const AVATAR_ANIMATIONS = [
  "idle",
  "waking",
  "sleeping",
  "drowsy",
  "excited",
  "celebrate",
  "happy",
  "laughing",
  "playful",
  "curious",
  "thinking",
  "searching",
  "working",
  "proud",
  "confused",
  "suspicious",
  "surprised",
  "shy",
  "sad",
  "scared",
  "angry",
  "bored",
  "listening",
];

// All 28 ready facial expressions extracted from Strobi's definition
export const AVATAR_EXPRESSIONS = [
  "neutral",
  "joyful-wide",
  "joyful-down-right",
  "playful-right",
  "curious-left",
  "upward-side-glance",
  "downward-gaze",
  "attentive-left",
  "small-attentive",
  "wide-downward-gaze",
  "wide-down-left",
  "gentle-downward-gaze",
  "shy-downward",
  "eyes-closed",
  "sleepy-squint",
  "drowsy-closed",
  "surprised-left",
  "surprised-wide-left",
  "skeptical-right",
  "skeptical-left",
  "suspicious-right",
  "uneasy-left",
  "angry-brows",
  "angry-left",
  "angry-right",
  "asymmetric-down-right",
  "asymmetric-up-left",
  "far-right-glance",
];

// Global mascot event dispatcher: triggers mascot reactions from anywhere in the app
export const mascot = {
  play(animation, speechText, durationMs) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("novexa:mascot:play", {
        detail: { animation, speechText, durationMs },
      })
    );
  },

  setExpression(expression, speechText) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("novexa:mascot:expression", {
        detail: { expression, speechText },
      })
    );
  },

  say(message, durationMs = 5000) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("novexa:mascot:say", {
        detail: { message, durationMs },
      })
    );
  },

  // High-level reaction helpers specified in the mascot guide
  celebrate(message = "Woohoo! Great job! 🎉") {
    this.play("celebrate", message, 3500);
  },

  excited(message = "Ooh, exciting! ✨") {
    this.play("excited", message, 2500);
  },

  confused(message = "Hmm, something doesn't look right... 🤔") {
    this.play("confused", message, 3200);
  },

  thinking(message = "Let me think about that... 💭") {
    this.play("thinking", message, 3000);
  },

  working(message = "Working on it right now... ⚙️") {
    this.play("working", message, 3000);
  },

  laughing(message = "Haha, that's fun! 😄") {
    this.play("laughing", message, 2600);
  },

  playful(message = "Ready for some grocery shopping fun! 🎈") {
    this.play("playful", message, 2800);
  },

  curious(message = "Ooh, what are we checking out here? 👀") {
    this.play("curious", message, 2800);
  },

  proud(message = "Look at that! Top tier choice! 🌟") {
    this.play("proud", message, 2800);
  },

  wakeUp() {
    this.play("waking", "I'm awake and ready to help! ✨", 2200);
  },

  sleep() {
    this.play("sleeping", "Zzz... taking a quick nap. 😴");
  },

  reset() {
    this.play("idle", null);
  },
};

// React hook for interacting with the mascot within components
export const useMascot = () => {
  const play = useCallback((anim, text, duration) => mascot.play(anim, text, duration), []);
  const say = useCallback((text, duration) => mascot.say(text, duration), []);
  const celebrate = useCallback((msg) => mascot.celebrate(msg), []);
  const excited = useCallback((msg) => mascot.excited(msg), []);
  const confused = useCallback((msg) => mascot.confused(msg), []);
  const thinking = useCallback((msg) => mascot.thinking(msg), []);
  const reset = useCallback(() => mascot.reset(), []);

  return {
    mascot,
    play,
    say,
    celebrate,
    excited,
    confused,
    thinking,
    reset,
  };
};

export default Avatar;