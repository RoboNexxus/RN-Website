"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  OrbitControls,
  Html,
  Center,
  Bounds,
} from "@react-three/drei";
import * as THREE from "three";
import { ANIMATION_CONFIG } from "@/lib/animation-config";
import { useAnimationPerformance, useIsMobile } from "@/lib/animation-utils";

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; retryCount: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("3D Model rendering error:", error);
    if (this.state.retryCount < 3) {
      setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          retryCount: prev.retryCount + 1,
        }));
      }, 1000 * Math.pow(2, this.state.retryCount));
    }
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}


function Model({ url, quality }: { url: string; quality: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  // Slow, steady spin — now rotates around the centered pivot
  useFrame((_, delta) => {
    if (ref.current && quality !== 'low') {
      ref.current.rotation.y += delta * ANIMATION_CONFIG.model.rotationSpeed;
    }
  });

  return (
    <group ref={ref} dispose={null}>
      {/* Center recalculates the bounding box AFTER rotation/scale,
          so the pivot is always the visual center regardless of
          how the original scan's geometry was offset */}
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

export default function HeroModel() {
  const { quality } = useAnimationPerformance();
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <ModelErrorBoundary fallback={<div className="w-full h-full flex items-center justify-center opacity-50">3D Model Unavailable</div>}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={isMobile ? 1 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)}
          frameloop={quality === 'low' ? 'demand' : 'always'}
        >
        {/* Dim ambient — let the rim lights do the work */}
        <ambientLight intensity={0.25} />

        {/* Cool white key light, just for shape definition */}
        <spotLight
          position={[6, 8, 6]}
          angle={0.25}
          penumbra={1}
          intensity={isMobile ? 0.3 : 0.6}
          castShadow={!isMobile}
        />

        {/* Brand cyan rim light — this is what ties it to the page */}
        <pointLight position={[-4, -2, -4]} color="#47a0b8" intensity={isMobile ? 4 : 8} distance={12} />
        <pointLight position={[0, 3, -5]} color="#02cadc" intensity={isMobile ? 3 : 6} distance={10} />

        {/* Darker HDRI than "city" — avoids the generic-product-render look */}
        <Environment preset="night" />

        <React.Suspense fallback={<Loader />}>
          {/* Bounds auto-fits the camera to the model regardless of
              screen size/aspect ratio — fixes the mobile clipping */}
          <Bounds fit clip observe margin={1.3}>
            <Model url="/model/model2.glb" quality={quality} />
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

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={ANIMATION_CONFIG.model.dampingFactor}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

useGLTF.preload("/model/model2.glb");