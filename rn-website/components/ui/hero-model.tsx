"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  // Auto rotate slowly
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={ref} dispose={null}>
      {/* 
        Adjusting rotation to achieve "front view nose down". 
        Increased scale to make it much larger.
      */}
      <primitive
        object={scene}
        rotation={[0.4, 0, 0]} // Tilt nose down
        scale={6}
        position={[0, 0, 0]}
      />
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
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Environment preset="city" />

        <React.Suspense fallback={<Loader />}>
          <Model url="/model/model2.glb" />
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.5}
            scale={15}
            blur={2}
            far={4}
          />
        </React.Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/model/model2.glb");
