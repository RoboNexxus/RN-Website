"use client";

import React, { useRef, useMemo } from "react";
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
import { useIsMobile } from "@/lib/animation-utils";

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

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      // Clamp delta to avoid huge jumps when tab loses/regains focus
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
      <div className="text-foreground text-sm tracking-widest uppercase opacity-50">
        Loading 3D...
      </div>
    </Html>
  );
}

export default function AboutModel() {
  const isMobile = useIsMobile();

  // Stabilize DPR so it never changes after mount and never causes a re-render
  const dpr = useMemo<[number, number]>(() => {
    if (typeof window === "undefined") return [1, 1];
    const ratio = Math.min(window.devicePixelRatio, 2);
    return [isMobile ? 1 : ratio, isMobile ? 1 : ratio];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <div className="w-full h-[50vh] md:h-[70vh] relative cursor-grab active:cursor-grabbing">
      <ModelErrorBoundary
        fallback={
          <div className="w-full h-full flex items-center justify-center opacity-50">
            3D Model Unavailable
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={dpr}
          frameloop="always"
        >
          <ambientLight intensity={0.25} />
          <spotLight
            position={[6, 8, 6]}
            angle={0.25}
            penumbra={1}
            intensity={isMobile ? 0.3 : 0.6}
            castShadow={!isMobile}
          />
          <pointLight
            position={[-4, -2, -4]}
            color="#47a0b8"
            intensity={isMobile ? 4 : 8}
            distance={12}
          />
          <pointLight
            position={[0, 3, -5]}
            color="#02cadc"
            intensity={isMobile ? 3 : 6}
            distance={10}
          />

          <Environment preset="night" />

          <React.Suspense fallback={<Loader />}>
            {/*
              Removed `observe` — it re-fits the camera whenever the parent
              element resizes (e.g. on scroll), causing size jumps.
              `fit` + `clip` on mount is enough.
            */}
            <Bounds fit clip margin={1.3}>
              <Model url="https://res.cloudinary.com/drqqqhudz/image/upload/v1782364353/abt-optimized_opl3kj.glb" />
            </Bounds>
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.5}
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

useGLTF.preload("https://res.cloudinary.com/drqqqhudz/image/upload/v1782364353/abt-optimized_opl3kj.glb");
