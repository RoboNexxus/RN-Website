// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface AnimationDurations {
  fast: number;
  slow: number;
  scrollReveal: number;
  flipText: number;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

interface SpringPresets {
  responsive: SpringConfig;
  smooth: SpringConfig;
  bouncy: SpringConfig;
}

interface EasingPresets {
  default: string;
  smooth: string;
}

interface StaggerDelays {
  tight: number;
  normal: number;
  loose: number;
}

interface ModelConfig {
  rotationSpeed: number;
}

export interface AnimationConfigType {
  duration: AnimationDurations;
  spring: SpringPresets;
  easing: EasingPresets;
  stagger: StaggerDelays;
  model: ModelConfig;
}

// ============================================================================
// Core Animation Configuration
// ============================================================================

export const ANIMATION_CONFIG: AnimationConfigType = {
  duration: {
    fast: 200,
    slow: 600,
    scrollReveal: 700,
    flipText: 2200,
  },

  spring: {
    responsive: { stiffness: 300, damping: 24 },
    smooth: { stiffness: 200, damping: 20 },
    bouncy: { stiffness: 500, damping: 30, mass: 0.5 },
  },

  easing: {
    default: 'outExpo',
    smooth: 'outCubic',
  },

  stagger: {
    tight: 45,
    normal: 80,
    loose: 100,
  },

  model: {
    rotationSpeed: 0.3,
  },
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

export function getAnimationConfig(options?: {
  respectMotionPreference?: boolean;
}): AnimationConfigType {
  const prefersReducedMotion =
    options?.respectMotionPreference &&
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return {
      ...ANIMATION_CONFIG,
      duration: {
        fast: Math.round(ANIMATION_CONFIG.duration.fast * 0.5),
        slow: Math.round(ANIMATION_CONFIG.duration.slow * 0.5),
        scrollReveal: Math.round(ANIMATION_CONFIG.duration.scrollReveal * 0.5),
        flipText: Math.round(ANIMATION_CONFIG.duration.flipText * 0.5),
      },
    };
  }

  return ANIMATION_CONFIG;
}
