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

// Helper to compute snap coordinate to nearest allowed wall at the VERY BOTTOM of the screen
const snapToNearestWall = (rawX, rawY) => {
  if (typeof window === "undefined") return { x: rawX, y: rawY, wall: "bottom" };
  const W = window.innerWidth;
  const H = window.innerHeight;
  const isMobile = W < 640;
  const size = isMobile ? 50 : 70;
  const padX = 12;
  const padBottom = isMobile ? 12 : 16;
  const bottomY = H - size - padBottom;

  // Clamp horizontally within viewport
  const clampX = Math.max(padX, Math.min(W - size - padX, rawX));

  // Snap horizontally towards left or right edges if close, else stay bottom
  const distLeft = clampX - padX;
  const distRight = W - size - padX - clampX;

  let wall = "bottom";
  let targetX = clampX;

  if (distLeft < 50) {
    targetX = padX;
    wall = "left";
  } else if (distRight < 50) {
    targetX = W - size - padX;
    wall = "right";
  }

  return { x: targetX, y: bottomY, wall };
};

export const MascotCompanion = () => {
  const location = useLocation();
  const avatarRef = useRef(null);
  const containerRef = useRef(null);
  const mascotBtnRef = useRef(null);

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Sound preference state: user's manual preference is strictly preserved
  const [soundPref, setSoundPref] = useState(() => isSoundEnabled());

  // Dynamic Draggable Position State (restored from localStorage, strictly clamped to bottom)
  const [position, setPosition] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("novexa_mascot_pos");
        if (saved) {
          const parsed = JSON.parse(saved);
          return snapToNearestWall(parsed.x, window.innerHeight);
        }
      } catch {}
    }
    return null; // null uses default responsive bottom-right: bottom-3 right-3 sm:bottom-4 sm:right-5
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    elX: 0,
    elY: 0,
    hasMoved: false,
  });

  // Position calculation for popups (Mood Playground & Speech Bubble)
  const [modalPos, setModalPos] = useState({
    direction: "up",
    align: "right",
    style: {},
  });

  const updateModalPosition = useCallback(() => {
    const el = mascotBtnRef.current || containerRef.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Available space above and below the mascot button
    const spaceAbove = rect.top;
    const spaceBelow = H - rect.bottom;

    // Standard behavior: open upwards unless dragged high up into the screen
    const openUp = spaceAbove >= 260 || spaceAbove >= spaceBelow;
    const direction = openUp ? "up" : "down";

    // Horizontal alignment: right if in right half of screen, left if in left half
    const mascotCenterX = rect.left + rect.width / 2;
    const align = mascotCenterX > W / 2 ? "right" : "left";

    const style = {
      position: "fixed",
      zIndex: 100,
    };

    if (openUp) {
      // Sits 28px above mascot's top (above quick action pills)
      const bottomPx = Math.max(10, H - rect.top + 28);
      style.bottom = `${bottomPx}px`;
      style.top = "auto";
      // Ensure modal never overflows top of viewport
      const maxH = Math.min(480, Math.max(220, H - bottomPx - 20));
      style.maxHeight = `${maxH}px`;
    } else {
      // Sits 12px below mascot's bottom
      const topPx = Math.max(10, rect.bottom + 12);
      style.top = `${topPx}px`;
      style.bottom = "auto";
      // Ensure modal never overflows bottom of viewport
      const maxH = Math.min(480, Math.max(220, H - topPx - 20));
      style.maxHeight = `${maxH}px`;
    }

    if (align === "right") {
      const rightPx = Math.max(10, W - rect.right);
      style.right = `${rightPx}px`;
      style.left = "auto";
    } else {
      const leftPx = Math.max(10, rect.left);
      style.left = `${leftPx}px`;
      style.right = "auto";
    }

    setModalPos({ direction, align, style });
  }, []);

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

  // Handle window resize: re-snap if positioned
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        const reSnapped = snapToNearestWall(prev.x, window.innerHeight);
        try {
          localStorage.setItem("novexa_mascot_pos", JSON.stringify(reSnapped));
        } catch {}
        return reSnapped;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Centralized Sound Player:
  // - If minimized -> AUTOMATICALLY OFF (0 sound)
  // - If user muted (soundPref === false) -> AUTOMATICALLY OFF
  // - When unminimized -> sound immediately restores to user's saved soundPref
  const playSound = useCallback(
    (type, isSpeechSound = false) => {
      if (isMinimized) return; // Completely silent when minimized
      if (!soundPref) return; // Silent if user muted
      if (isSpeechSound && !showBubble) return; // Silent if speech hints are closed

      playMascotSound(type);
    },
    [isMinimized, soundPref, showBubble]
  );

  // Safe animation trigger via ref (silenced completely when minimized)
  const playAnimation = useCallback(
    (animName, text = null, durationMs = 2800, isPersistent = false) => {
      if (isMinimized) return;

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      if (prefersReducedMotion) {
        avatarRef.current?.setExpression?.("neutral");
        setCurrentMood(animName);
        if (text && !isMinimized && showBubble) {
          setSpeechMessage(text);
          setShowBubble(true);
        }
        return;
      }

      if (avatarRef.current?.play) {
        avatarRef.current.play(animName);
      }
      setCurrentMood(animName);

      if (text && !isMinimized && showBubble) {
        setSpeechMessage(text);
        setShowBubble(true);

        if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          if (animName !== "sleeping" && !showMoodTray) {
            setShowBubble(false);
          }
        }, Math.max(durationMs + 2000, 6000));
      }

      if (!isPersistent && animName !== "idle" && animName !== "sleeping") {
        resetTimerRef.current = setTimeout(() => {
          if (avatarRef.current?.play) {
            avatarRef.current.play("idle");
          }
          setCurrentMood("idle");
        }, durationMs);
      }
    },
    [prefersReducedMotion, showMoodTray, isMinimized, showBubble]
  );

  // Click outside listener: closes modal/mood tray instantly and smoothly docks mascot
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Don't close if clicked inside the mascot container, mood tray dialog, or speech bubble status
      if (
        (containerRef.current && containerRef.current.contains(e.target)) ||
        e.target.closest("[role='dialog']") ||
        e.target.closest("[role='status']")
      ) {
        return;
      }

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
      // Smoothly dock towards nearest wall when clicking outside
      setIsDocked(true);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showMoodTray, showBubble, currentMood]);

  // Reposition modal on open, window resize, scroll, or mascot position update
  useEffect(() => {
    if (showMoodTray || showBubble) {
      updateModalPosition();
      const onReposition = () => updateModalPosition();
      window.addEventListener("resize", onReposition);
      window.addEventListener("scroll", onReposition, { passive: true });
      return () => {
        window.removeEventListener("resize", onReposition);
        window.removeEventListener("scroll", onReposition);
      };
    }
  }, [showMoodTray, showBubble, position, isDocked, updateModalPosition]);

  // 1. Initial page load reaction: "waking" -> "idle" after 2.4s
  useEffect(() => {
    if (hasMountedRef.current || isMinimized) return;
    hasMountedRef.current = true;

    playSound("wake");
    playAnimation(
      "waking",
      "Good day! Novie is ready to assist your shopping! ✨",
      2400
    );
  }, [playAnimation, isMinimized, playSound]);

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

  // 3. User inactivity detection: 30s no activity -> "drowsy" -> "sleeping"
  const wakeUpFromSleep = useCallback(() => {
    if (isSleeping && !isMinimized) {
      setIsSleeping(false);
      playSound("wake");
      playAnimation("waking", "I'm back! Let's find some groceries! ✨", 2200);
    }
  }, [isSleeping, playAnimation, isMinimized, playSound]);

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
          playSound("sleep");
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
  }, [isSleeping, playAnimation, wakeUpFromSleep, prefersReducedMotion, isMinimized, playSound]);

  // 4. Ambient Lively Mood Changer
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

  // 5. React on main buttons hover: "excited"
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

  // 6. Global Custom Event Bus Listeners
  useEffect(() => {
    const handlePlayEvent = (e) => {
      if (isMinimized) return;
      const { animation, speechText, durationMs } = e.detail || {};
      if (animation) {
        if (animation === "celebrate") playSound("celebrate");
        else if (animation === "confused") playSound("confused");
        else if (animation === "angry") playSound("angry");
        else playSound("pop");

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
        playSound("click", true);
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
  }, [playAnimation, isMinimized, playSound]);

  // Drag handlers for free dragging across the screen
  const handleDragStart = (clientX, clientY) => {
    const el = mascotBtnRef.current || containerRef.current;
    const rect = el?.getBoundingClientRect();
    if (!rect) return;

    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      elX: rect.left,
      elY: rect.top,
      hasMoved: false,
    };

    const handleMove = (moveX, moveY) => {
      const dx = moveX - dragStartRef.current.mouseX;
      const dy = moveY - dragStartRef.current.mouseY;

      if (!dragStartRef.current.hasMoved && Math.hypot(dx, dy) > 5) {
        dragStartRef.current.hasMoved = true;
        setIsDragging(true);
        setShowMoodTray(false);
        setShowBubble(false);
        setIsDocked(false);
      }

      if (dragStartRef.current.hasMoved) {
        const nextX = dragStartRef.current.elX + dx;
        const H = window.innerHeight;
        const isMobile = window.innerWidth < 640;
        const size = isMobile ? 50 : 70;
        const padBottom = isMobile ? 12 : 16;
        const bottomY = H - size - padBottom;
        setPosition({ x: nextX, y: bottomY, wall: "bottom" });
      }
    };

    const handleEnd = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);

      if (dragStartRef.current.hasMoved) {
        setIsDragging(false);
        // Snap strictly to bottom-left, bottom-right, or bottom edge
        setPosition((prev) => {
          if (!prev) return null;
          const snapped = snapToNearestWall(prev.x, window.innerHeight);
          try {
            localStorage.setItem("novexa_mascot_pos", JSON.stringify(snapped));
          } catch {}
          return snapped;
        });
        requestAnimationFrame(() => updateModalPosition());
      }
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEnd();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
  };

  // Click on Novie: only fires if not dragged
  const handleMascotClick = () => {
    if (dragStartRef.current.hasMoved) return; // Prevent clicking while dragging
    setIsDocked(false);
    if (isSleeping) {
      wakeUpFromSleep();
      return;
    }

    playSound("pop");
    const nextMood = CLICK_MOODS[quoteIndexRef.current % CLICK_MOODS.length];
    const quote = FUN_QUOTES[quoteIndexRef.current % FUN_QUOTES.length];
    quoteIndexRef.current += 1;

    playAnimation(nextMood, quote, 2800);
  };

  // Next Tip action inside speech bubble
  const handleNextTip = () => {
    playSound("click", true);
    const quote = FUN_QUOTES[quoteIndexRef.current % FUN_QUOTES.length];
    quoteIndexRef.current += 1;
    playAnimation("happy", quote, 3000);
  };

  // Toggle Sound preference (persists user manual preference)
  const handleToggleSound = () => {
    const nextState = !soundPref;
    setSoundPref(nextState);
    setSoundEnabled(nextState);
    if (nextState && !isMinimized) {
      playMascotSound("pop");
    }
  };

  // Select mood from playground (with loud sound and persistent playback)
  const handleSelectMood = (mood) => {
    if (mood === "celebrate") playSound("celebrate");
    else if (mood === "confused") playSound("confused");
    else if (mood === "sleeping") playSound("sleep");
    else if (mood === "angry") playSound("angry");
    else playSound("pop");

    const moodSpeech =
      mood === "angry"
        ? "Grrr! Novie is super angry! 😡💥"
        : `Playing mood: "${mood}"! ✨`;

    playAnimation(mood, moodSpeech, 0, true);
  };

  // Determine wall orientation for speech bubble & docking
  const activeWall = position?.wall || "right";
  const alignSide = activeWall === "left" ? "left" : "right";

  // Compute docked translate classes based on active wall
  const getDockClasses = () => {
    if (!isDocked || isMinimized || isDragging) return "translate-x-0 translate-y-0 opacity-100";
    if (activeWall === "left") {
      return "-translate-x-6 sm:-translate-x-8 opacity-85 hover:translate-x-0 hover:opacity-100";
    } else if (activeWall === "bottom") {
      return "translate-y-6 sm:translate-y-7 opacity-85 hover:translate-y-0 hover:opacity-100";
    } else {
      return "translate-x-6 sm:translate-x-8 opacity-85 hover:translate-x-0 hover:opacity-100";
    }
  };

  return (
    <>
      <aside
        ref={containerRef}
        aria-label="Novie Mascot Assistant"
        className={`fixed z-[90] pointer-events-none select-none ${
          position ? "" : "bottom-3 right-3 sm:bottom-4 sm:right-5"
        }`}
        style={
          position
            ? {
                left: `${position.x}px`,
                top: `${position.y}px`,
                bottom: "auto",
                right: "auto",
                transition: isDragging
                  ? "none"
                  : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.3s ease, top 0.3s ease",
              }
            : undefined
        }
      >
        <div
          ref={mascotBtnRef}
          className={`flex flex-col ${
            alignSide === "left" ? "items-start" : "items-end"
          } pointer-events-auto transition-transform duration-300 ease-out group ${getDockClasses()}`}
          onMouseEnter={() => {
            // "hover karne pe bahar aye"
            if (isDocked && !isMinimized) setIsDocked(false);
          }}
        >
          {/* Minimized floating button (Clean, silent badge with no popup) */}
          {isMinimized ? (
            <button
              type="button"
              onClick={() => {
                setIsMinimized(false);
                setIsDocked(false);
                // Unminimizing restores sound preference as it was!
                if (soundPref) playMascotSound("wake");
                playAnimation("happy", "I'm back! Let's explore Novexa! 🌟", 2200);
              }}
              title="Expand Novie Mascot"
              className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Novie</span>
              <Maximize2 size={13} className="opacity-75 group-hover:opacity-100" />
            </button>
          ) : (
            /* Full Mascot Widget (Draggable & Clickable) */
            <div className="relative flex flex-col items-center">
              {/* Quick Action Pills above Novie */}
              <div
                className={`absolute -top-6 sm:-top-7 ${
                  alignSide === "left" ? "left-0" : "right-0"
                } flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full shadow-md border border-indigo-100 text-[10px] sm:text-[11px] font-medium text-gray-600`}
              >
                {/* Moods Playground button */}
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setIsDocked(false);
                    setShowMoodTray((prev) => {
                      const next = !prev;
                      if (next) {
                        setShowBubble(false);
                        requestAnimationFrame(() => updateModalPosition());
                      }
                      return next;
                    });
                  }}
                  title="Open Mood Playground"
                  className="flex items-center gap-1 px-1 py-0.5 rounded hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <Sparkles size={11} className="text-amber-500" />
                  <span>Moods</span>
                </button>

                <span className="text-gray-300">|</span>

                {/* Chat tip toggle */}
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setIsDocked(false);
                    setShowBubble((prev) => {
                      const next = !prev;
                      if (next) {
                        setShowMoodTray(false);
                        requestAnimationFrame(() => updateModalPosition());
                      }
                      return next;
                    });
                  }}
                  title={showBubble ? "Hide message" : "Show tip"}
                  className="p-1 rounded hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
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
                  className="p-1 rounded hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Minimize Novie"
                >
                  <Minus size={11} />
                </button>
              </div>

              {/* Clickable & Draggable Mascot Canvas with Angry red and shaking support */}
              <button
                type="button"
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onTouchStart={(e) => {
                  if (e.touches[0])
                    handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onClick={handleMascotClick}
                onDoubleClick={() => {
                  playSound("celebrate");
                  playAnimation("celebrate", "Double tap! You're awesome! 🎉🌟", 3200);
                }}
                title="Drag Novie to place anywhere along left, right or bottom walls! Click to interact!"
                aria-label="Novie mascot - Drag to reposition or click to interact"
                className={`relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-full ${
                  isDragging
                    ? "cursor-grabbing scale-110 shadow-2xl"
                    : "cursor-grab hover:scale-105 active:scale-95"
                } ${isAngry ? "is-angry-shaking" : ""}`}
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
                  className={`w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] drop-shadow-md transition-all duration-300 pointer-events-none ${
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

      {/* Mood Playground Tray (Always positioned safely on screen above/below Novie) */}
      {!isMinimized && showMoodTray && (
        <MascotMoodTray
          currentMood={currentMood}
          onSelectMood={handleSelectMood}
          align={modalPos.align}
          direction={modalPos.direction}
          style={modalPos.style}
          onReset={() => {
            playSound("pop");
            playAnimation("idle", "Back to calm and steady idle! 💫", 2000);
          }}
          onClose={() => {
            setShowMoodTray(false);
            playAnimation("idle", null, 0);
          }}
        />
      )}

      {/* Speech Bubble (Always positioned safely on screen above/below Novie) */}
      {!isMinimized && !showMoodTray && showBubble && (
        <MascotSpeechBubble
          message={speechMessage}
          mood={currentMood}
          isSoundOn={soundPref}
          onToggleSound={handleToggleSound}
          onClose={() => setShowBubble(false)}
          onNextTip={handleNextTip}
          isSleeping={isSleeping}
          align={modalPos.align}
          direction={modalPos.direction}
          style={modalPos.style}
        />
      )}
    </>
  );
};

export default MascotCompanion;
