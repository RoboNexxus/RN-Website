"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  Html,
  Center,
  Bounds,
} from "@react-three/drei";
import * as THREE from "three";
import { ANIMATION_CONFIG } from "@/lib/animation-config";

// ─── Error Boundary ──────────────────────────────────────────────────────────

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("3D Model rendering error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}

// ─── WebGL Support Check ─────────────────────────────────────────────────────

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

// ─── 3D Model Component ───────────────────────────────────────────────────────

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      const safeDelta = Math.min(delta, 0.05);
      ref.current.rotation.y += safeDelta * ANIMATION_CONFIG.model.rotationSpeed;
    }
  });

  return (
    <group ref={ref} dispose={null}>
      <Center>
        <primitive object={scene} rotation={[0.4, 0, 0]} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="text-white text-sm tracking-widest uppercase opacity-50">
        Loading 3D...
      </div>
    </Html>
  );
}

// ─── Fallback UI (shown when WebGL unavailable) ───────────────────────────────

function ModelFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-40 select-none">
      {/* Simple robot SVG as visual placeholder */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-cyan-400"
      >
        <rect x="20" y="28" width="40" height="32" rx="6" stroke="currentColor" strokeWidth="2" />
        <rect x="30" y="18" width="20" height="12" rx="4" stroke="currentColor" strokeWidth="2" />
        <line x1="40" y1="18" x2="40" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="12" r="2" fill="currentColor" />
        <circle cx="31" cy="42" r="4" fill="currentColor" opacity="0.6" />
        <circle cx="49" cy="42" r="4" fill="currentColor" opacity="0.6" />
        <rect x="28" y="52" width="24" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="38" x2="10" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="38" x2="70" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="60" x2="28" y2="72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="60" x2="52" y2="72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-white text-xs tracking-wider font-light" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
        3D model unavailable
      </span>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function HeroModel() {
  // Detect WebGL support and mobile *after* mount to avoid SSR mismatch
  const [ready, setReady] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const webglOk = supportsWebGL();

    if (webglOk) {
      const ratio = Math.min(window.devicePixelRatio ?? 1, isMobile ? 1.5 : 2);
      setDpr([ratio, ratio]);
      setCanRender(true);
    }

    setReady(true);
  }, []);

  // Don't render anything until we've checked on the client
  if (!ready) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-sm tracking-widest uppercase opacity-30">
          Loading 3D...
        </div>
      </div>
    );
  }

  if (!canRender) {
    return <ModelFallback />;
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <ModelErrorBoundary fallback={<ModelFallback />}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={dpr}
          frameloop="always"
          gl={{
            // Prefer WebGL2 but fall back gracefully
            powerPreference: "default",
            antialias: true,
            alpha: true,
            // Prevent context-loss issues on mobile
            preserveDrawingBuffer: false,
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.25} />
          <spotLight
            position={[6, 8, 6]}
            angle={0.25}
            penumbra={1}
            intensity={0.6}
            castShadow={false}
          />
          <pointLight
            position={[-4, -2, -4]}
            color="#47a0b8"
            intensity={8}
            distance={12}
          />
          <pointLight
            position={[0, 3, -5]}
            color="#02cadc"
            intensity={6}
            distance={10}
          />

          <Environment preset="night" />

          <React.Suspense fallback={<Loader />}>
            <Bounds fit clip margin={1.3}>
              <Model url="https://res.cloudinary.com/drqqqhudz/image/upload/v1782364353/model2-optimized_vs55gn.glb" />
            </Bounds>
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.15}
              scale={15}
              blur={2}
              far={4}
              color="#000000"
            />
          </React.Suspense>
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

useGLTF.preload("https://res.cloudinary.com/drqqqhudz/image/upload/v1782364353/model2-optimized_vs55gn.glb");