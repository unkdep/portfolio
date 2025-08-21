"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface ModelProps {
  url?: string;
}

function Model({ url = "/modelo.gltf" }: ModelProps) {
  const gltf = useGLTF(url); // deixa o TypeScript inferir o tipo
  const ref = useRef<THREE.Group>(null);

  // Animação de flutuação
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002; // rotação contínua
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 1) * 0.1; // sobe e desce suavemente
    }
  });

  return <primitive ref={ref} object={gltf.scene} scale={1} />;
}

export default function ThreeDModel() {
  return (
    <Canvas>
      <Stage environment="city" intensity={0.6}>
        <Model />
      </Stage>
      <OrbitControls autoRotate enableZoom={true} />
    </Canvas>
  );
}
