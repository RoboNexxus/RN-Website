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

// ─── 3D Rock Model Component ──────────────────────────────────────────────────

function Rock() {
  const { scene } = useGLTF(
    "https://res.cloudinary.com/drqqqhudz/image/upload/v1783508978/rock-optimised_i1rtau.glb"
  );
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
        <primitive object={scene} scale={1.5} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-neutral-400 text-sm tracking-widest uppercase">
          Loading Model...
        </div>
      </div>
    </Html>
  );
}

// ─── Fallback UI ─────────────────────────────────────────────────────────────

function ModelFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center opacity-40 gap-4">
      <svg
        className="w-16 h-16 text-neutral-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <span className="text-neutral-700 text-xs tracking-wider font-light">
        3D model unavailable
      </span>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function RockModel() {
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

  if (!ready) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-neutral-700 text-sm tracking-widest uppercase opacity-30 animate-pulse">
          Initializing...
        </div>
      </div>
    );
  }

  if (!canRender) {
    return <ModelFallback />;
  }

  return (
    <div className="w-full h-full relative">
      <ModelErrorBoundary fallback={<ModelFallback />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          dpr={dpr}
          frameloop="always"
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
          }}
        >
          {/* Dramatic Lighting Setup */}
          <ambientLight intensity={0.4} />
          
          {/* Key light from top-right */}
          <spotLight
            position={[8, 10, 6]}
            angle={0.3}
            penumbra={1}
            intensity={1.2}
            castShadow={false}
            color="#ffffff"
          />
          
          {/* Fill light from left with green tint */}
          <pointLight
            position={[-6, 4, 4]}
            color="#22c55e"
            intensity={15}
            distance={15}
          />
          
          {/* Rim light from behind with stronger green */}
          <pointLight
            position={[0, -3, -8]}
            color="#16a34a"
            intensity={20}
            distance={18}
          />
          
          {/* Accent light from bottom */}
          <pointLight
            position={[0, -5, 0]}
            color="#84cc16"
            intensity={8}
            distance={12}
          />

          <Environment preset="night" />

          <React.Suspense fallback={<Loader />}>
            <Bounds fit clip margin={1.4}>
              <Rock />
            </Bounds>
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.7}
              scale={12}
              blur={2.5}
              far={5}
              color="#000000"
            />
          </React.Suspense>
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

// Preload the model
useGLTF.preload(
  "https://res.cloudinary.com/drqqqhudz/image/upload/v1783508978/rock-optimised_i1rtau.glb"
);
