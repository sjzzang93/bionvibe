'use client';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
function Crystal() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <octahedronGeometry args={[1,0]} />
      <meshStandardMaterial metalness={0.7} roughness={0.2} />
    </mesh>
  )
}
export default function Scene() {
  return (
    <div className="h-64 rounded-2xl overflow-hidden border">
      <Canvas>
        <hemisphereLight intensity={0.9} />
        <Suspense fallback={null}>
          <Crystal />
          <OrbitControls enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}