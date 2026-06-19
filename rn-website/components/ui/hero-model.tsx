"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
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
        Scale might need tweaking depending on the model's original size.
      */}
      <primitive
        object={scene}
        rotation={[Math.PI / 6, 0, 0]} // Tilt nose down
        scale={2.5}
        position={[0, -1, 0]}
      />
    </group>
  );
}

export default function HeroModel() {
  return (
    <div className="w-[400px] h-[400px] relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Environment preset="city" />

        <React.Suspense fallback={null}>
          <Model url="/model/model2.glb" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
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
