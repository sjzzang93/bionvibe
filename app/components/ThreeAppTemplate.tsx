"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import RelatedApps from '@/app/components/RelatedApps';

interface ThreeAppTemplateProps {
    title: string;
    description: string;
    icon: string;
    primaryColor: string; // hex
    secondaryColor: string; // hex
    appSlug: string;
    children?: React.ReactNode;
}

function Scene({ primaryColor, secondaryColor }: { primaryColor: string, secondaryColor: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={1} color={secondaryColor} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere ref={meshRef} args={[1.5, 64, 64]}>
                    <MeshDistortMaterial
                        color={primaryColor}
                        envMapIntensity={0.4}
                        clearcoat={0.8}
                        clearcoatRoughness={0}
                        metalness={0.1}
                        distort={0.4}
                        speed={2}
                    />
                </Sphere>
            </Float>
        </>
    );
}

export default function ThreeAppTemplate({
    title,
    description,
    icon,
    primaryColor,
    secondaryColor,
    appSlug,
    children
}: ThreeAppTemplateProps) {
    return (
        <main className="min-h-screen w-full bg-slate-950 text-white relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>

            <div className="flex-1 flex flex-col mx-auto w-full max-w-6xl px-4 py-8 relative z-10">

                {/* Header */}
                <header className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
                    <Link href="/" className="absolute left-4 top-8 text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                        <span className="text-2xl">{icon}</span>
                        <span className="text-sm font-medium text-white/90">3D Interactive App</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {title}
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl">
                        {description}
                    </p>
                </header>

                {/* 3D Canvas Area */}
                <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/20 backdrop-blur-sm mb-12 group">
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 rounded-full text-xs text-white/60 backdrop-blur-md">
                        Interactive 3D View
                    </div>

                    <Canvas className="w-full h-full" camera={{ position: [0, 0, 5], fov: 45 }}>
                        <Scene primaryColor={primaryColor} secondaryColor={secondaryColor} />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                        <div className="text-center text-white/60 text-sm">
                            드래그하여 3D 오브젝트를 회전시켜보세요
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-6 h-6" style={{ color: primaryColor }} />
                            <h2 className="text-2xl font-bold">시작하기</h2>
                        </div>
                        {children ? children : (
                            <div className="space-y-4 text-slate-300">
                                <p>이 앱은 현재 준비 중입니다. 곧 멋진 기능으로 찾아뵙겠습니다.</p>
                                <Button className="w-full" style={{ backgroundColor: primaryColor }}>
                                    알림 받기
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm flex flex-col justify-center items-center text-center">
                        <h3 className="text-xl font-bold mb-4">앱 정보</h3>
                        <p className="text-slate-400 mb-6">
                            이 앱은 최신 WebGL 기술을 사용하여<br />
                            몰입감 넘치는 3D 경험을 제공합니다.
                        </p>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-black/20 rounded-xl p-4">
                                <div className="text-sm text-slate-500">Version</div>
                                <div className="font-mono">1.0.0</div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-4">
                                <div className="text-sm text-slate-500">Engine</div>
                                <div className="font-mono">Three.js</div>
                            </div>
                        </div>
                    </div>
                </div>

                <RelatedApps currentAppSlug={appSlug} />
            </div>
        </main>
    );
}
