"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees. Default: 12 */
  maxTilt?: number;
}

/**
 * TiltCard
 *
 * 3D mouse-tracking tilt with GSAP spring-like smoothing.
 *
 * Emil's principle: decorative mouse-tracking should use springs
 * so it has momentum (feels natural, not mechanical).
 *
 * Properties: rotateX, rotateY (transform only — GPU only)
 * Spring: stiffness=200, damping=20 via GSAP quickTo
 *
 * Also adds a moving specular highlight inside the card that
 * tracks the mouse — like light reflecting off a physical surface.
 */
export default function TiltCard({ children, className = "", maxTilt = 12 }: TiltCardProps) {
  const cardRef      = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const isHovered    = useRef(false);

  // quickTo for spring-like smoothing — lower duration = more responsive
  const rotateXTo    = useRef<gsap.QuickToFunc | null>(null);
  const rotateYTo    = useRef<gsap.QuickToFunc | null>(null);
  const glowXTo      = useRef<gsap.QuickToFunc | null>(null);
  const glowYTo      = useRef<gsap.QuickToFunc | null>(null);

  const initQuickTo = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    rotateXTo.current = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3.out" });
    rotateYTo.current = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3.out" });
    glowXTo.current   = gsap.quickTo(glow, "x",       { duration: 0.4, ease: "power3.out" });
    glowYTo.current   = gsap.quickTo(glow, "y",       { duration: 0.4, ease: "power3.out" });
  }, []);

  const onMouseEnter = useCallback(() => {
    isHovered.current = true;
    initQuickTo();
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, { scale: 1.04, z: 30, duration: 0.4, ease: "power3.out" });
    gsap.to(glowRef.current, { autoAlpha: 0.15, duration: 0.3 });
  }, [initQuickTo]);

  const onMouseLeave = useCallback(() => {
    isHovered.current = false;
    const card = cardRef.current;
    if (!card) return;
    // Spring back to rest
    rotateXTo.current?.(0);
    rotateYTo.current?.(0);
    gsap.to(card, { scale: 1, z: 0, rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
    gsap.to(glowRef.current, { autoAlpha: 0, duration: 0.4 });
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered.current) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    // Normalised position: -1 to 1
    const nx = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    const ny = ((e.clientY - rect.top)  / rect.height) * 2 - 1;

    rotateXTo.current?.(-ny * maxTilt);
    rotateYTo.current?.(nx * maxTilt);

    // Move specular glow to cursor position (in %)
    const gx = (e.clientX - rect.left) / rect.width  * 100;
    const gy = (e.clientY - rect.top)  / rect.height * 100;
    glowXTo.current?.(gx);
    glowYTo.current?.(gy);
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={`tilt-card relative ${className}`}
      style={{ perspective: "800px", transformStyle: "preserve-3d", willChange: "transform" } as React.CSSProperties}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      data-cursor="pointer"
    >
      {/* Specular highlight — tracks cursor inside the card */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden z-20"
        style={{ opacity: 0 }}
      >
        <div
          style={{
            position: "absolute",
            width: "60%",
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)",
            borderRadius: "50%",
            top: "var(--gy, 50%)",
            left: "var(--gx, 50%)",
          }}
        />
      </div>

      {children}
    </div>
  );
}
