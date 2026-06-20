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

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  // Slow, steady spin — now rotates around the centered pivot
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
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
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Dim ambient — let the rim lights do the work */}
        <ambientLight intensity={0.25} />

        {/* Cool white key light, just for shape definition */}
        <spotLight
          position={[6, 8, 6]}
          angle={0.25}
          penumbra={1}
          intensity={0.6}
          castShadow
        />

        {/* Brand cyan rim light — this is what ties it to the page */}
        <pointLight position={[-4, -2, -4]} color="#47a0b8" intensity={8} distance={12} />
        <pointLight position={[0, 3, -5]} color="#02cadc" intensity={6} distance={10} />

        {/* Darker HDRI than "city" — avoids the generic-product-render look */}
        <Environment preset="night" />

        <React.Suspense fallback={<Loader />}>
          {/* Bounds auto-fits the camera to the model regardless of
              screen size/aspect ratio — fixes the mobile clipping */}
          <Bounds fit clip observe margin={1.3}>
            <Model url="/model/model2.glb" />
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
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/model/model2.glb");