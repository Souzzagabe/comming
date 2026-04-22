"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springConfig = { stiffness: 250, damping: 28, mass: 0.5 };
  const trailConfig = { stiffness: 80, damping: 20, mass: 0.8 };

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothTrailX = useSpring(trailX, trailConfig);
  const smoothTrailY = useSpring(trailY, trailConfig);

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        trailX.set(e.clientX);
        trailY.set(e.clientY);
      });
      if (!visible) setVisible(true);
    }

    function onDown() { setClicking(true); }
    function onUp() { setClicking(false); }
    function onLeave() { setVisible(false); }
    function onEnter() { setVisible(true); }

    function updateHover() {
      const el = document.querySelectorAll("a, button, [data-cursor-hover]");
      el.forEach((node) => {
        node.addEventListener("mouseenter", () => setHovering(true));
        node.addEventListener("mouseleave", () => setHovering(false));
      });
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    updateHover();

    const observer = new MutationObserver(updateHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY, trailX, trailY, visible]);

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1.5px solid rgba(0,200,255,0.4)",
          borderRadius: "50%",
        }}
        animate={{
          width: hovering ? 44 : clicking ? 20 : 36,
          height: hovering ? 44 : clicking ? 20 : 36,
          opacity: visible ? 1 : 0,
          borderColor: hovering ? "rgba(0,200,255,0.8)" : "rgba(0,200,255,0.4)",
          boxShadow: hovering
            ? "0 0 16px rgba(0,200,255,0.6), 0 0 32px rgba(0,200,255,0.25)"
            : "0 0 8px rgba(0,200,255,0.3)",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "#00C8FF",
        }}
        animate={{
          width: clicking ? 6 : hovering ? 8 : 6,
          height: clicking ? 6 : hovering ? 8 : 6,
          opacity: visible ? 1 : 0,
          boxShadow: hovering
            ? "0 0 12px rgba(0,200,255,1), 0 0 24px rgba(0,200,255,0.6)"
            : "0 0 6px rgba(0,200,255,0.8)",
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
