"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

function PlateScene() {
  const markerRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!markerRef.current) {
      return;
    }

    markerRef.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.34}>
      <group rotation={[0.18, -0.42, 0]}>
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[1.45, 1.55, 0.12, 96]} />
          <meshStandardMaterial color="#f7f2e8" roughness={0.32} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.025, 16, 96]} />
          <meshStandardMaterial color="#d8bd78" roughness={0.26} metalness={0.45} />
        </mesh>
        <mesh ref={markerRef} position={[0, 0.32, 0]}>
          <icosahedronGeometry args={[0.36, 0]} />
          <meshStandardMaterial color="#d6b25e" roughness={0.18} metalness={0.72} />
        </mesh>
        <mesh position={[-0.74, 0.12, -0.48]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color="#b22d2d" roughness={0.34} />
        </mesh>
        <mesh position={[0.82, 0.14, 0.42]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color="#425a46" roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

export function MichelinHeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.3, 4.2], fov: 36 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#12100d"]} />
      <fog attach="fog" args={["#12100d", 4.5, 8]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={2.2} />
      <pointLight position={[-2, 1.2, 1]} color="#b22d2d" intensity={3.5} />
      <pointLight position={[2, 1.8, -1]} color="#d6b25e" intensity={2.2} />
      <PlateScene />
    </Canvas>
  );
}
