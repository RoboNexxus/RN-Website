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
