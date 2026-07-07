export function CornerSquiggles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M -20,120 Q 80,80 120,150 T 220,100" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
      <path d="M -40,150 Q 60,110 100,180 T 200,130" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" className="opacity-60" />
      <path d="M -60,180 Q 40,140 80,210 T 180,160" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" className="opacity-40" />
    </svg>
  );
}

export function CornerZigZag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 0,20 L 40,80 L 20,140 L 80,180 L 100,220" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
      <path d="M 30,0 L 70,60 L 50,120 L 110,160 L 130,200" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="opacity-60" />
      <path d="M 60,-20 L 100,40 L 80,100 L 140,140 L 160,180" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="opacity-40" />
    </svg>
  );
}

export function CornerBurst({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinecap="round" className="opacity-80">
        <path d="M 20,20 L 120,60" strokeWidth="14" />
        <path d="M 20,20 L 60,120" strokeWidth="10" />
        <path d="M 20,20 L 150,10" strokeWidth="8" />
        <path d="M 20,20 L 10,150" strokeWidth="12" />
        <path d="M 20,20 L 140,110" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function CornerDots({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor" className="opacity-70">
        <circle cx="160" cy="40" r="12" />
        <circle cx="120" cy="30" r="8" />
        <circle cx="170" cy="80" r="10" />
        <circle cx="130" cy="110" r="6" />
        <circle cx="80" cy="50" r="14" />
        <circle cx="180" cy="130" r="8" />
        <circle cx="70" cy="100" r="10" />
      </g>
    </svg>
  );
}

export function CornerCrosses({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="12" className="opacity-70">
        <path d="M 40,40 L 80,80 M 80,40 L 40,80" />
        <path d="M 120,20 L 150,50 M 150,20 L 120,50" strokeWidth="8" />
        <path d="M 20,120 L 50,150 M 50,120 L 20,150" strokeWidth="10" />
        <path d="M 140,110 L 180,150 M 180,110 L 140,150" strokeWidth="14" />
        <path d="M 80,160 L 100,180 M 100,160 L 80,180" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function CornerWiggles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 10,100 C 40,80 60,120 90,100 C 120,80 140,120 170,100" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
      <path d="M 10,130 C 40,110 60,150 90,130 C 120,110 140,150 170,130" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="opacity-60" />
      <path d="M 10,160 C 40,140 60,180 90,160 C 120,140 140,180 170,160" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="opacity-40" />
    </svg>
  );
}
