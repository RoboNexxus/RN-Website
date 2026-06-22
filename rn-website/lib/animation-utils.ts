// Animation Utilities Module
// Performance monitoring and animation helper functions

import { useEffect, useState, useRef } from 'react';
import { QualityLevel, getPerformanceConfig, type PerformanceConfig } from './animation-config';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface AnimationPerformanceMetrics {
  quality: QualityLevel;
  config: PerformanceConfig;
  averageFPS?: number;
  frameDropCount?: number;
}

export interface WillChangeConfig {
  properties: string[];
  enabled: boolean;
}

// ============================================================================
// Performance Monitoring Hook
// ============================================================================

/**
 * Monitor animation performance and automatically adjust quality based on FPS
 * 
 * Quality thresholds:
 * - Low: < 30 FPS
 * - Medium: 30-50 FPS
 * - High: > 50 FPS
 * 
 * Validates: Requirements 4.2
 * 
 * @returns Object containing current quality level and performance config
 */
export function useAnimationPerformance(): AnimationPerformanceMetrics {
  const [quality, setQuality] = useState<QualityLevel>('high');
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const [averageFPS, setAverageFPS] = useState<number | undefined>(undefined);

  useEffect(() => {
    let frameId: number;

    const measureFrame = (timestamp: number) => {
      if (lastFrameTimeRef.current !== 0) {
        const frameDuration = timestamp - lastFrameTimeRef.current;
        frameTimesRef.current.push(frameDuration);

        // Keep last 60 frame measurements for accurate average
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }

        // Calculate average FPS every 60 frames
        if (frameTimesRef.current.length === 60) {
          const avgFrameTime =
            frameTimesRef.current.reduce((a, b) => a + b, 0) / 60;
          const fps = 1000 / avgFrameTime;
          setAverageFPS(fps);

          // Adjust quality based on FPS thresholds
          // Requirement 4.2: Reduce animation complexity when frame rate drops below budget
          if (fps < 30 && quality !== 'low') {
            setQuality('low');
          } else if (fps >= 30 && fps < 50 && quality !== 'medium') {
            setQuality('medium');
          } else if (fps >= 50 && quality !== 'high') {
            setQuality('high');
          }
        }
      }

      lastFrameTimeRef.current = timestamp;
      frameId = requestAnimationFrame(measureFrame);
    };

    frameId = requestAnimationFrame(measureFrame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [quality]);

  return {
    quality,
    config: getPerformanceConfig(quality),
    averageFPS,
  };
}

// ============================================================================
// Will-Change Property Management Hook
// ============================================================================

/**
 * Apply will-change CSS property to hint browser optimizations
 * 
 * Validates: Requirements 4.3
 * 
 * The will-change property tells the browser which properties are likely to change,
 * allowing it to optimize rendering. This hook automatically applies the property
 * on mount and removes it on unmount to avoid memory overhead.
 * 
 * @param ref - React ref to the element
 * @param properties - Array of CSS properties that will change (e.g., ['transform', 'opacity'])
 * 
 * @example
 * const elementRef = useRef<HTMLDivElement>(null);
 * useWillChange(elementRef, ['transform', 'opacity']);
 */
export function useWillChange(
  ref: React.RefObject<HTMLElement | null>,
  properties: string[]
): void {
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    // Apply will-change hint for GPU acceleration
    element.style.willChange = properties.join(', ');

    // Cleanup: Remove will-change to avoid memory overhead
    // The browser will keep layers around if will-change is always set
    return () => {
      element.style.willChange = 'auto';
    };
  }, [ref, properties]);
}

// ============================================================================
// DOM Batching Utility
// ============================================================================

/**
 * Batch DOM operations to prevent layout thrashing
 * 
 * Validates: Requirements 4.4
 * 
 * Layout thrashing occurs when you read and write to the DOM repeatedly,
 * causing the browser to recalculate layout multiple times. This function
 * batches all operations into a single animation frame to avoid that.
 * 
 * @param operations - Array of functions to execute in batch
 * 
 * @example
 * batchDOMOperations([
 *   () => element1.style.transform = 'translateX(100px)',
 *   () => element2.style.opacity = '0.5',
 *   () => element3.classList.add('active')
 * ]);
 */
export function batchDOMOperations(operations: Array<() => void>): void {
  requestAnimationFrame(() => {
    operations.forEach(op => op());
  });
}

// ============================================================================
// Mobile Detection Hook
// ============================================================================

/**
 * Hook to detect if the user is on a mobile device based on screen width
 * 
 * Validates: Requirements 3.2, 3.4
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

// ============================================================================
// Exports
// ============================================================================

export type { QualityLevel, PerformanceConfig } from './animation-config';
