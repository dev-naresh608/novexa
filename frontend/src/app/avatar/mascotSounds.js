// Lightweight procedural audio effects using Web Audio API (Loud, crisp & expressive)
let audioCtx = null;
let soundEnabled = true;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const isSoundEnabled = () => soundEnabled;

export const setSoundEnabled = (enabled) => {
  soundEnabled = !!enabled;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("novexa_mascot_sound", soundEnabled ? "1" : "0");
    } catch {
      // ignore
    }
  }
};

if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("novexa_mascot_sound");
    if (saved !== null) {
      soundEnabled = saved === "1";
    }
  } catch {
    // ignore
  }
}

export const playMascotSound = (type) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    // High, crisp volume (User requested: "sound thoda jyada rakho / sound jydaa")
    masterGain.gain.setValueAtTime(0.32, now);
    masterGain.connect(ctx.destination);

    if (type === "pop" || type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.09); // C6
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "wake") {
      // Bright, cheerful 2-note ascending chime
      [523.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.28, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.28);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.29);
      });
    } else if (type === "celebrate") {
      // Triumphant 4-note celebration chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.32, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.32);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.34);
      });
    } else if (type === "angry") {
      // Grumpy, comic low rumble buzz for "angry" mood!
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.linearRampToValueAtTime(95, now + 0.35);

      osc2.type = "square";
      osc2.frequency.setValueAtTime(146, now);
      osc2.frequency.linearRampToValueAtTime(100, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.44);
      osc2.stop(now + 0.44);
    } else if (type === "sleep") {
      // Gentle soft descending sigh
      [587.33, 440, 329.63].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.14);
        gain.gain.setValueAtTime(0.001, now + i * 0.14);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.14 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.35);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.36);
      });
    } else if (type === "confused") {
      // Curious question-mark slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(370, now);
      osc.frequency.linearRampToValueAtTime(290, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.32);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.39);
    }
  } catch {
    // Autoplay policy fallback
  }
};
