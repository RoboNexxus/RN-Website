"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

function Logo() {
  const meshRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("https://res.cloudinary.com/drqqqhudz/image/upload/v1783427413/logo-optimized_evx5on.glb");

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={1.5} />;
}

export default function EventLogoModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} />
          <Logo />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
