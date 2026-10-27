import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Avatar, AVATAR_ANIMATIONS } from "./avatar";
import MascotSpeechBubble from "./MascotSpeechBubble";
import MascotMoodTray from "./MascotMoodTray";
import { playMascotSound, isSoundEnabled, setSoundEnabled } from "./mascotSounds";
import { Sparkles, MessageSquare, Minus, Maximize2 } from "lucide-react";
import "./avatar.css";

// Contextual guide tips based on page path
const ROUTE_TIPS = {
  "/": "Welcome to Novexa! Explore farm-fresh veggies, fruits & grocery essentials delivered fast! 🥦🍎",
  "/stores": "Browse verified local supermarkets and vendors near you! 🏪",
  "/cart": "Review your items! Don't forget to check coupon discounts before checking out! 🛒✨",
  "/dashboard": "Welcome to your personal dashboard! Monitor recent orders and savings here! 📊",
  "/orders": "Here are all your orders! Tap any order to view live delivery status! 📦",
  "/active-orders": "Your order is in transit! Freshness is on its way to your doorstep! 🛵💨",
  "/favourite": "Your favorite grocery picks! Tap add to cart whenever you run low! ❤️",
  "/wishlist": "Saved items wishlist! Keep track of must-buys for your kitchen! ⭐",
  "/allnotifications": "Check the latest store discounts, flash sales & delivery alerts! 🔔",
  "/profile": "Manage your saved addresses, phone number and account security here! 📍",
  "/setting": "Customize your account settings and notification preferences! ⚙️",
  "/addproducts": "Seller hub: Add new grocery items with high-res photos and competitive pricing! 🏷️",
  "/product-list": "Seller catalog: keep prices and inventory status up to date! 📋",
  "/earnings": "Driver partner: track your daily completed deliveries and earnings! 💰",
};

// Fun interactive quotes when clicking on Novie
const FUN_QUOTES = [
  "Hehe, that tickles! Looking for the crispiest apples today? 🍎",
  "Did you know Novexa delivers groceries at lightning speed? ⚡",
  "Carrots improve night vision, but my eyes are already huge! 👀🥕",
  "Tip: Save your frequent items to Wishlist for 1-click reordering! ❤️",
  "Fresh avocados just arrived in stores! Perfect for guacamole! 🥑",
  "I'm Novie, your friendly 3D grocery buddy! Tap me anytime! ✨",
  "Eating colorful veggies every day keeps you energetic and healthy! 🌈",
  "Need help finding something? Try the search bar at the top! 🔍",
  "Great to have you here! Let's get cooking something delicious! 🍳",
  "Did you remember to grab milk and eggs? Never forget the essentials! 🥛🥚",
];

const CLICK_MOODS = [
  "laughing",
  "playful",
  "excited",
  "happy",
  "celebrate",
  "proud",
  "curious",
];

const AMBIENT_IDLE_MOODS = [
  "curious",
  "happy",
  "playful",
  "thinking",
  "searching",
  "listening",
  "proud",
];

export const MascotCompanion = () => {
  const location = useLocation();
  const avatarRef = useRef(null);
  const containerRef = useRef(null);

  // States
  const [currentMood, setCurrentMood] = useState("idle");
  const [speechMessage, setSpeechMessage] = useState(
    "Hi there! I'm Novie, your Novexa mascot. Let's find great groceries! ✨"
  );
  const [showBubble, setShowBubble] = useState(true);
  const [showMoodTray, setShowMoodTray] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDocked, setIsDocked] = useState(false); // Smooth edge-docking state
  const [isSleeping, setIsSleeping] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Timers
  const resetTimerRef = useRef(null);
  const speechTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const drowsyTimerRef = useRef(null);
  const quoteIndexRef = useRef(0);
  const hasMountedRef = useRef(false);

  const isAngry = currentMood === "angry";

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Safe animation trigger via ref (silenced completely when minimized)
  const playAnimation = useCallback(
    (animName, text = null, durationMs = 2800, isPersistent = false) => {
      // If minimized, do not play any animations, suggestions, or popups
      if (isMinimized) return;

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      if (prefersReducedMotion) {
        avatarRef.current?.setExpression?.("neutral");
        setCurrentMood(animName);
        if (text && !isMinimized) {
          setSpeechMessage(text);
          setShowBubble(true);
        }
        return;
      }

      if (avatarRef.current?.play) {
        avatarRef.current.play(animName);
      }
      setCurrentMood(animName);

      if (text && !isMinimized) {
        setSpeechMessage(text);
        setShowBubble(true);

        if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          if (animName !== "sleeping" && !showMoodTray) {
            setShowBubble(false);
          }
        }, Math.max(durationMs + 2000, 6000));
      }

      // If this is a temporary reaction (not persistent and not idle/sleeping), reset back to idle after duration
      if (!isPersistent && animName !== "idle" && animName !== "sleeping") {
        resetTimerRef.current = setTimeout(() => {
          if (avatarRef.current?.play) {
            avatarRef.current.play("idle");
          }
          setCurrentMood("idle");
        }, durationMs);
      }
    },
    [prefersReducedMotion, showMoodTray, isMinimized]
  );

  // Click outside listener: closes modal/mood tray instantly and smoothly docks mascot
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (showMoodTray || showBubble) {
          setShowMoodTray(false);
          setShowBubble(false);
          if (
            avatarRef.current?.play &&
            currentMood !== "idle" &&
            currentMood !== "sleeping"
          ) {
            avatarRef.current.play("idle");
            setCurrentMood("idle");
          }
        }
        // Smoothly dock towards edge when user clicks away on the side
        setIsDocked(true);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showMoodTray, showBubble, currentMood]);

  // 1. Initial page load reaction: "waking" -> "idle" after 2.4s (Page 7 of Guide)
  useEffect(() => {
    if (hasMountedRef.current || isMinimized) return;
    hasMountedRef.current = true;

    playMascotSound("wake");
    playAnimation(
      "waking",
      "Good day! Novie is ready to assist your shopping! ✨",
      2400
    );
  }, [playAnimation, isMinimized]);

  // 2. React to route changes / sections navigation (silent when minimized)
  useEffect(() => {
    if (!hasMountedRef.current || isMinimized) return;

    if (isSleeping) {
      setIsSleeping(false);
      playAnimation("waking", null, 1500);
    }

    const path = location.pathname;
    let tip = ROUTE_TIPS[path];
    if (!tip) {
      if (path.startsWith("/stores/menu") || path.startsWith("/allproducts")) {
        tip = "Fresh picks today! Filter by category or explore delicious grocery items! 🥗";
      } else if (path.startsWith("/product/")) {
        tip = "Check nutrition info, ratings, and add to your cart for instant delivery! 🍎";
      } else if (path.startsWith("/orders/")) {
        tip = "Tracking your grocery order in real-time! 📦";
      } else {
        tip = "Happy shopping on Novexa! Let me know if you need anything! ✨";
      }
    }

    playAnimation("curious", tip, 3000);
  }, [location.pathname, playAnimation, isSleeping, isMinimized]);

  // 3. User inactivity detection: 30s no activity -> "drowsy" -> "sleeping" (disabled when minimized)
  const wakeUpFromSleep = useCallback(() => {
    if (isSleeping && !isMinimized) {
      setIsSleeping(false);
      playMascotSound("wake");
      playAnimation("waking", "I'm back! Let's find some groceries! ✨", 2200);
    }
  }, [isSleeping, playAnimation, isMinimized]);

  useEffect(() => {
    if (prefersReducedMotion || isMinimized) return;

    const resetIdleTimer = () => {
      if (isSleeping) {
        wakeUpFromSleep();
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (drowsyTimerRef.current) clearTimeout(drowsyTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        if (isMinimized) return;
        playAnimation("drowsy", "Getting a little sleepy... 🥱", 2800);

        drowsyTimerRef.current = setTimeout(() => {
          if (isMinimized) return;
          setIsSleeping(true);
          playMascotSound("sleep");
          playAnimation(
            "sleeping",
            "Zzz... taking a power nap. Move your mouse or tap me to wake me up! 😴",
            999999
          );
        }, 3000);
      }, 30000);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((evt) =>
      window.addEventListener(evt, resetIdleTimer, { passive: true })
    );

    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (drowsyTimerRef.current) clearTimeout(drowsyTimerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [isSleeping, playAnimation, wakeUpFromSleep, prefersReducedMotion, isMinimized]);

  // 4. Ambient Lively Mood Changer (completely silent & stopped when minimized)
  useEffect(() => {
    if (prefersReducedMotion || isMinimized) return;

    let ambientTimer = null;
    const scheduleNextAmbient = () => {
      const delay = Math.floor(Math.random() * 5000) + 9000;
      ambientTimer = setTimeout(() => {
        if (
          !isMinimized &&
          currentMood === "idle" &&
          !isSleeping &&
          !showMoodTray &&
          !isDocked
        ) {
          const randomMood =
            AMBIENT_IDLE_MOODS[
              Math.floor(Math.random() * AMBIENT_IDLE_MOODS.length)
            ];
          playAnimation(randomMood, null, 2600);
        }
        scheduleNextAmbient();
      }, delay);
    };

    scheduleNextAmbient();

    return () => {
      if (ambientTimer) clearTimeout(ambientTimer);
    };
  }, [currentMood, isSleeping, showMoodTray, isDocked, playAnimation, prefersReducedMotion, isMinimized]);

  // 5. React on main buttons hover: "excited" (disabled when minimized)
  useEffect(() => {
    if (prefersReducedMotion || isMinimized) return;

    let hoverTimeout = null;

    const handleMouseOver = (e) => {
      if (isSleeping || showMoodTray || isMinimized) return;
      const target = e.target.closest("button, a, [role='button']");
      if (!target) return;

      const isMainButton =
        target.matches("button[type='submit']") ||
        target.classList.contains("btn-primary") ||
        target.className.includes("bg-emerald") ||
        target.className.includes("bg-green") ||
        target.hasAttribute("data-mascot-hover");

      if (isMainButton && currentMood === "idle") {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          if (!isMinimized) {
            playAnimation("excited", null, 1800);
          }
        }, 80);
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      clearTimeout(hoverTimeout);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [currentMood, isSleeping, showMoodTray, playAnimation, prefersReducedMotion, isMinimized]);

  // 6. Global Custom Event Bus Listeners (disabled when minimized)
  useEffect(() => {
    const handlePlayEvent = (e) => {
      if (isMinimized) return;
      const { animation, speechText, durationMs } = e.detail || {};
      if (animation) {
        if (animation === "celebrate") playMascotSound("celebrate");
        else if (animation === "confused") playMascotSound("confused");
        else if (animation === "angry") playMascotSound("angry");
        else playMascotSound("pop");

        setIsDocked(false);
        playAnimation(animation, speechText, durationMs || 3000);
      }
    };

    const handleExpressionEvent = (e) => {
      if (isMinimized) return;
      const { expression, speechText } = e.detail || {};
      if (expression && avatarRef.current?.setExpression) {
        avatarRef.current.setExpression(expression);
        if (speechText) {
          setSpeechMessage(speechText);
          setShowBubble(true);
        }
      }
    };

    const handleSayEvent = (e) => {
      if (isMinimized) return;
      const { message, durationMs } = e.detail || {};
      if (message) {
        setIsDocked(false);
        setSpeechMessage(message);
        setShowBubble(true);
        playMascotSound("click");
        if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          setShowBubble(false);
        }, durationMs || 5000);
      }
    };

    window.addEventListener("novexa:mascot:play", handlePlayEvent);
    window.addEventListener("novexa:mascot:expression", handleExpressionEvent);
    window.addEventListener("novexa:mascot:say", handleSayEvent);

    return () => {
      window.removeEventListener("novexa:mascot:play", handlePlayEvent);
      window.removeEventListener("novexa:mascot:expression", handleExpressionEvent);
      window.removeEventListener("novexa:mascot:say", handleSayEvent);
    };
  }, [playAnimation, isMinimized]);

  // Click on Novie: cycles through rich set of happy animations + witty quotes
  const handleMascotClick = () => {
    setIsDocked(false);
    if (isSleeping) {
      wakeUpFromSleep();
      return;
    }

    playMascotSound("pop");
    const nextMood = CLICK_MOODS[quoteIndexRef.current % CLICK_MOODS.length];
    const quote = FUN_QUOTES[quoteIndexRef.current % FUN_QUOTES.length];
    quoteIndexRef.current += 1;

    playAnimation(nextMood, quote, 2800);
  };

  // Next Tip action inside speech bubble
  const handleNextTip = () => {
    playMascotSound("click");
    const quote = FUN_QUOTES[quoteIndexRef.current % FUN_QUOTES.length];
    quoteIndexRef.current += 1;
    playAnimation("happy", quote, 3000);
  };

  // Toggle Sound preference
  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playMascotSound("pop");
    }
  };

  // Select mood from playground (with loud sound and persistent playback)
  const handleSelectMood = (mood) => {
    if (mood === "celebrate") playMascotSound("celebrate");
    else if (mood === "confused") playMascotSound("confused");
    else if (mood === "sleeping") playMascotSound("sleep");
    else if (mood === "angry") playMascotSound("angry");
    else playMascotSound("pop");

    const moodSpeech =
      mood === "angry"
        ? "Grrr! Novie is super angry! 😡💥"
        : `Playing mood: "${mood}"! ✨`;

    playAnimation(mood, moodSpeech, 0, true);
  };

  return (
    <aside
      ref={containerRef}
      aria-label="Novie Mascot Assistant"
      className="fixed z-[90] pointer-events-none select-none bottom-20 right-2 sm:bottom-6 sm:right-5 transition-all duration-300"
    >
      <div
        className={`flex flex-col items-end pointer-events-auto transition-transform duration-300 ease-out group ${
          isDocked && !isMinimized
            ? "translate-x-6 sm:translate-x-8 opacity-85 hover:translate-x-0 hover:opacity-100"
            : "translate-x-0 opacity-100"
        }`}
        onMouseEnter={() => {
          // "hover karne pe bahar aye"
          if (isDocked && !isMinimized) setIsDocked(false);
        }}
      >
        {/* Mood Playground Tray (Never shown when minimized) */}
        {!isMinimized && showMoodTray && (
          <MascotMoodTray
            currentMood={currentMood}
            onSelectMood={handleSelectMood}
            onReset={() => {
              playMascotSound("pop");
              playAnimation("idle", "Back to calm and steady idle! 💫", 2000);
            }}
            onClose={() => {
              setShowMoodTray(false);
              playAnimation("idle", null, 0);
            }}
          />
        )}

        {/* Speech Bubble (Completely hidden when minimized, as requested) */}
        {!isMinimized && !showMoodTray && showBubble && (
          <MascotSpeechBubble
            message={speechMessage}
            mood={currentMood}
            isSoundOn={soundOn}
            onToggleSound={handleToggleSound}
            onClose={() => setShowBubble(false)}
            onNextTip={handleNextTip}
            isSleeping={isSleeping}
          />
        )}

        {/* Minimized floating button (Clean, silent badge with no popup) */}
        {isMinimized ? (
          <button
            type="button"
            onClick={() => {
              setIsMinimized(false);
              setIsDocked(false);
              playMascotSound("wake");
              playAnimation("happy", "I'm back! Let's explore Novexa! 🌟", 2200);
            }}
            title="Expand Novie Mascot"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Novie</span>
            <Maximize2 size={13} className="opacity-75 group-hover:opacity-100" />
          </button>
        ) : (
          /* Full Mascot Widget (40% reduced size: 70px desktop, 50px mobile) */
          <div className="relative flex flex-col items-center">
            {/* Quick Action Pills above Novie */}
            <div className="absolute -top-6 sm:-top-7 right-0 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full shadow-md border border-indigo-100 text-[10px] sm:text-[11px] font-medium text-gray-600">
              {/* Moods Playground button */}
              <button
                type="button"
                onClick={() => {
                  playMascotSound("click");
                  setShowMoodTray((prev) => !prev);
                  if (showBubble) setShowBubble(false);
                }}
                title="Open Mood Playground"
                className="flex items-center gap-1 px-1 py-0.5 rounded hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Sparkles size={11} className="text-amber-500" />
                <span>Moods</span>
              </button>

              <span className="text-gray-300">|</span>

              {/* Chat tip toggle */}
              <button
                type="button"
                onClick={() => {
                  playMascotSound("click");
                  setShowBubble((prev) => !prev);
                }}
                title={showBubble ? "Hide message" : "Show tip"}
                className="p-1 rounded hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <MessageSquare size={11} />
              </button>

              <span className="text-gray-300">|</span>

              {/* Minimize button: completely closes popups and turns off suggestions */}
              <button
                type="button"
                onClick={() => {
                  setIsMinimized(true);
                  setShowMoodTray(false);
                  setShowBubble(false);
                }}
                title="Minimize Novie"
                className="p-1 rounded hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Minimize Novie"
              >
                <Minus size={11} />
              </button>
            </div>

            {/* Clickable Mascot Canvas with Angry red and shaking support */}
            <button
              type="button"
              onClick={handleMascotClick}
              onDoubleClick={() => {
                playMascotSound("celebrate");
                playAnimation("celebrate", "Double tap! You're awesome! 🎉🌟", 3200);
              }}
              title="Click Novie to interact! Double click to celebrate!"
              aria-label="Novie mascot - Click to interact"
              className={`relative cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-full ${
                isAngry ? "is-angry-shaking" : "hover:scale-105 active:scale-95"
              }`}
            >
              {/* Soft ambient ground glow (red when angry) */}
              <div
                className={`absolute inset-x-1 -bottom-0.5 h-3 blur-sm rounded-full pointer-events-none transition-colors duration-300 ${
                  isAngry ? "bg-red-500/50" : "bg-indigo-500/20"
                }`}
                aria-hidden="true"
              />

              {/* The Novie 3D Avatar (Red & scaled slightly when angry) */}
              <div
                className={`w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] drop-shadow-md transition-all duration-300 ${
                  isAngry ? "is-angry-red scale-110" : ""
                }`}
              >
                <Avatar
                  ref={avatarRef}
                  defaultAnimation="idle"
                  size="100%"
                  className="w-full h-full"
                  ariaLabel="Novie 3D Animated Mascot"
                />
              </div>

              {/* Comic anger icon if angry */}
              {isAngry && (
                <span
                  className="absolute -top-3 -right-2 text-base select-none animate-bounce"
                  aria-hidden="true"
                >
                  💢
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MascotCompanion;
