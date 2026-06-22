// Animation Configuration Module
// Centralized animation constants and utilities for consistent timing and easing

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface AnimationDurations {
  instant: number;
  fast: number;
  normal: number;
  slow: number;
  pageHero: number;
  scrollReveal: number;
  flipText: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

export interface SpringPresets {
  default: SpringConfig;
  responsive: SpringConfig;
  smooth: SpringConfig;
  bouncy: SpringConfig;
}

export interface EasingPresets {
  default: string;
  smooth: string;
  sharp: string;
}

export interface StaggerDelays {
  tight: number;
  normal: number;
  loose: number;
}

export interface ModelPerformanceConfig {
  rotationSpeed: number;
  dampingFactor: number;
  targetFPS: {
    desktop: number;
    mobile: number;
  };
}

export interface AnimationConfigType {
  duration: AnimationDurations;
  spring: SpringPresets;
  easing: EasingPresets;
  stagger: StaggerDelays;
  model: ModelPerformanceConfig;
}

// ============================================================================
// Core Animation Configuration
// ============================================================================

export const ANIMATION_CONFIG: AnimationConfigType = {
  // Durations (in milliseconds)
  duration: {
    instant: 150,
    fast: 200,
    normal: 300,
    slow: 600,
    pageHero: 800,
    scrollReveal: 700,
    flipText: 2200,
  },
  
  // Framer Motion spring parameters
  spring: {
    default: { stiffness: 300, damping: 25 },
    responsive: { stiffness: 300, damping: 24 },
    smooth: { stiffness: 200, damping: 20 },
    bouncy: { stiffness: 500, damping: 30, mass: 0.5 },
  },
  
  // Anime.js easing functions
  easing: {
    default: 'outExpo',
    smooth: 'outCubic',
    sharp: 'outQuad',
  },
  
  // Stagger delays (in milliseconds)
  stagger: {
    tight: 45,
    normal: 80,
    loose: 100,
  },
  
  // 3D model performance
  model: {
    rotationSpeed: 0.3,
    dampingFactor: 0.05,
    targetFPS: { desktop: 60, mobile: 30 },
  },
} as const;

// ============================================================================
// Performance Configuration Types
// ============================================================================

export type QualityLevel = 'high' | 'medium' | 'low';

export interface PerformanceConfig {
  enableComplexAnimations: boolean;
  targetFPS: number;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get animation configuration with accessibility support
 * @param options - Configuration options
 * @param options.respectMotionPreference - Whether to respect prefers-reduced-motion setting
 * @param options.isDark - Whether dark mode is enabled (for future theme-aware animations)
 * @returns Animation configuration object
 */
export function getAnimationConfig(options?: {
  respectMotionPreference?: boolean;
  isDark?: boolean;
}): AnimationConfigType {
  const prefersReducedMotion =
    options?.respectMotionPreference &&
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Reduce animation durations by 50% for users who prefer reduced motion
    return {
      ...ANIMATION_CONFIG,
      duration: {
        instant: Math.round(ANIMATION_CONFIG.duration.instant * 0.5),
        fast: Math.round(ANIMATION_CONFIG.duration.fast * 0.5),
        normal: Math.round(ANIMATION_CONFIG.duration.normal * 0.5),
        slow: Math.round(ANIMATION_CONFIG.duration.slow * 0.5),
        pageHero: Math.round(ANIMATION_CONFIG.duration.pageHero * 0.5),
        scrollReveal: Math.round(ANIMATION_CONFIG.duration.scrollReveal * 0.5),
        flipText: Math.round(ANIMATION_CONFIG.duration.flipText * 0.5),
      },
    };
  }

  return ANIMATION_CONFIG;
}

/**
 * Get performance configuration based on quality level
 * @param quality - Quality level (high, medium, or low)
 * @returns Performance configuration object
 */
export function getPerformanceConfig(quality: QualityLevel): PerformanceConfig {
  switch (quality) {
    case 'high':
      return { enableComplexAnimations: true, targetFPS: 60 };
    case 'medium':
      return { enableComplexAnimations: true, targetFPS: 30 };
    case 'low':
      return { enableComplexAnimations: false, targetFPS: 30 };
  }
}

// ============================================================================
// Exports
// ============================================================================

// Export all configuration constants and utility functions
export default ANIMATION_CONFIG;
