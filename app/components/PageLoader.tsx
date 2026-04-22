"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(pct));
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 200);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--color-background)]"
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glow orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, #00C8FF0A 0%, transparent 70%)",
            }}
          />

          {/* Logo / initials */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center gap-8"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={60}
              className="w-auto object-contain"
              style={{ height: "clamp(48px, 8vw, 80px)" }}
              priority
            />

            {/* Progress bar */}
            <div className="w-48 h-px bg-[var(--color-border)] relative overflow-hidden rounded-full">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                  boxShadow: "0 0 8px #00C8FF88",
                }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Counter */}
            <span className="font-mono text-xs text-[var(--color-muted)] tracking-[0.3em]">
              {String(progress).padStart(3, "0")}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
