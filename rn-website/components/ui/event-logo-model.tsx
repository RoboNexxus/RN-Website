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

function Logo() {
  const { scene } = useGLTF("https://res.cloudinary.com/drqqqhudz/image/upload/v1783427413/logo-optimized_evx5on.glb");
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
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="text-neutral-700 text-sm tracking-widest uppercase opacity-50">
        Loading...
      </div>
    </Html>
  );
}

// ─── Fallback UI ─────────────────────────────────────────────────────────────

function ModelFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center opacity-40">
      <span className="text-neutral-700 text-xs tracking-wider font-light">
        3D model unavailable
      </span>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function EventLogoModel() {
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
        <div className="text-neutral-700 text-sm tracking-widest uppercase opacity-30">
          Loading...
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
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={dpr}
          frameloop="always"
          gl={{
            powerPreference: "default",
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <spotLight
            position={[6, 8, 6]}
            angle={0.25}
            penumbra={1}
            intensity={0.7}
            castShadow={false}
          />
          <pointLight
            position={[-4, -2, -4]}
            color="#22c55e"
            intensity={10}
            distance={12}
          />
          <pointLight
            position={[0, 3, -5]}
            color="#16a34a"
            intensity={8}
            distance={10}
          />

          <Environment preset="night" />

          <React.Suspense fallback={<Loader />}>
            <Bounds fit clip margin={1.2}>
              <Logo />
            </Bounds>
            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.6}
              scale={10}
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

useGLTF.preload("https://res.cloudinary.com/drqqqhudz/image/upload/v1783427413/logo-optimized_evx5on.glb");

