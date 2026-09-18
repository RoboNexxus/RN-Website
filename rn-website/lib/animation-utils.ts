import { useEffect, useState } from 'react';

// ============================================================================
// Will-Change Property Management Hook
// ============================================================================

export function useWillChange(
  ref: React.RefObject<HTMLElement | null>,
  properties: string[]
): void {
  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    element.style.willChange = properties.join(', ');
    return () => {
      element.style.willChange = 'auto';
    };
  }, [ref, properties]);
}

// ============================================================================
// Mobile Detection Hook
// ============================================================================

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

// ============================================================================
// Low-End Device Detection Hook
//
// A device is considered "low-end" when ANY of these conditions are true:
//   • CPU cores  ≤ 4        (navigator.hardwareConcurrency)
//   • RAM        ≤ 2 GB     (navigator.deviceMemory — Chrome/Edge/Opera only)
//   • Network    slow-2g / 2g  (navigator.connection.effectiveType)
//   • User has requested reduced motion  (prefers-reduced-motion: reduce)
//
// On SSR / unsupported browsers the hook returns false (high-end assumed)
// so content is never incorrectly hidden during hydration.
// ============================================================================

export function useIsLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState<boolean>(false);

  useEffect(() => {
    // Reduced-motion preference — always respected
    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // CPU cores — most browsers expose this
    const cores = navigator.hardwareConcurrency ?? 8;

    // RAM — Chrome/Edge/Opera only; undefined elsewhere → treat as capable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ram: number = (navigator as any).deviceMemory ?? 8;

    // Network speed — Chrome/Edge only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conn = (navigator as any).connection;
    const slowNetwork =
      conn &&
      (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g');

    const lowEnd =
      prefersReducedMotion || cores <= 4 || ram <= 2 || slowNetwork === true;

    setIsLowEnd(lowEnd);
  }, []);

  return isLowEnd;
}
