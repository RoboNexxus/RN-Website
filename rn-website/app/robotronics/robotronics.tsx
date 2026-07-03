"use client";

import { useEffect } from 'react';

export default function Robotronics() {
  useEffect(() => {
    window.location.href = "https://robotronics-ten.vercel.app/";
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p className="text-white">Redirecting to Robotronics...</p>
    </main>
  );
}
