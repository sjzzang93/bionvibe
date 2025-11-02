'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Zap, Heart, Briefcase, GraduationCap, Home, Baby, Trophy, Plane, DollarSign, Brain, Target, Shuffle } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

interface LifeChoice {
  id: string;
  age: number;
  question: string;
  options: {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    consequences: {
      career: number;
      love: number;
      wealth: number;
      happiness: number;
      health: number;
    };
  }[];
}

interface Universe {
  id: string;
  timeline: {
    age: number;
    choice: string;
    event: string;
  }[];
  stats: {
    career: number;
    love: number;
    wealth: number;
    happiness: number;
    health: number;
  };
  color: string;
  position: THREE.Vector3;
  connections: string[];
}

const LIFE_CHOICES: LifeChoice[] = [
  {
    id: 'education',
    age: 18,
    question: '대학 진학을 어떻게 할까요?',
    options: [
      { text: '명문대 진학', icon: GraduationCap, consequences: { career: 20, love: -5, wealth: 15, happiness: 10, health: -10 } },
      { text: '해외 유학', icon: Plane, consequences: { career: 25, love: -10, wealth: -20, happiness: 15, health: 5 } },
      { text: '창업 도전', icon: Target, consequences: { career: 30, love: 0, wealth: -10, happiness: 20, health: -15 } },
      { text: '바로 취업', icon: Briefcase, consequences: { career: 10, love: 10, wealth: 20, happiness: 5, health: 0 } }
    ]
  },
  {
    id: 'career',
    age: 25,
    question: '커리어 방향을 정해야 해요',
    options: [
      { text: '대기업 입사', icon: Briefcase, consequences: { career: 25, love: -10, wealth: 30, happiness: 0, health: -10 } },
      { text: '스타트업 창업', icon: Zap, consequences: { career: 35, love: -15, wealth: -15, happiness: 25, health: -20 } },
      { text: '프리랜서', icon: Brain, consequences: { career: 20, love: 15, wealth: 10, happiness: 30, health: 10 } },
      { text: '공무원 준비', icon: Trophy, consequences: { career: 15, love: 5, wealth: 20, happiness: 10, health: 5 } }
    ]
  },
  {
    id: 'love',
    age: 30,
    question: '인생의 동반자를 만났어요',
    options: [
      { text: '결혼하기', icon: Heart, consequences: { career: -5, love: 40, wealth: -10, happiness: 30, health: 10 } },
      { text: '연애 지속', icon: Heart, consequences: { career: 5, love: 20, wealth: 5, happiness: 20, health: 5 } },
      { text: '커리어 집중', icon: Target, consequences: { career: 30, love: -20, wealth: 25, happiness: -10, health: -5 } },
      { text: '혼자 살기', icon: Home, consequences: { career: 15, love: -10, wealth: 20, happiness: 15, health: 15 } }
    ]
  },
  {
    id: 'midlife',
    age: 40,
    question: '인생의 전환점이 왔어요',
    options: [
      { text: '이직/전직', icon: Shuffle, consequences: { career: 20, love: -5, wealth: 10, happiness: 15, health: -5 } },
      { text: '은퇴 준비', icon: DollarSign, consequences: { career: -10, love: 10, wealth: 30, happiness: 20, health: 15 } },
      { text: '새로운 도전', icon: Zap, consequences: { career: 25, love: 5, wealth: -15, happiness: 30, health: -10 } },
      { text: '현재 유지', icon: Home, consequences: { career: 5, love: 15, wealth: 15, happiness: 10, health: 10 } }
    ]
  }
];

export default function ParallelUniverseSimulator() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const universesRef = useRef<Map<string, THREE.Group>>(new Map());
  const frameRef = useRef<number>(0);
  const starsRef = useRef<THREE.Points | null>(null);
  const timelineRef = useRef<THREE.Mesh | null>(null);

  const [currentAge, setCurrentAge] = useState(0);
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const initThreeJS = useCallback(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.FogExp2(0x000814, 0.001);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 50, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight),
      0.8,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 500;
    controls.minDistance = 20;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x8080ff, 1);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Add central timeline
    const timelineGeometry = new THREE.CylinderGeometry(1, 1, 200, 32);
    const timelineMaterial = new THREE.MeshPhongMaterial({
      color: 0x4040ff,
      emissive: 0x2020ff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.3
    });
    const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
    scene.add(timeline);
    timelineRef.current = timeline;
  }, []);

  const createUniverse = (universe: Universe) => {
    const group = new THREE.Group();

    // Universe sphere
    const geometry = new THREE.SphereGeometry(8, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(universe.color),
      emissive: new THREE.Color(universe.color),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    group.add(sphere);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(10, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(universe.color),
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    // Add orbit ring
    const ringGeometry = new THREE.TorusGeometry(15, 0.5, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(universe.color),
      emissive: new THREE.Color(universe.color),
      emissiveIntensity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    group.position.copy(universe.position);
    group.userData = { universeId: universe.id };

    return group;
  };

  const disposeGroup = (group: THREE.Group) => {
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  };

  const updateUniverses = () => {
    if (!sceneRef.current) return;

    // Remove and dispose old universes
    universesRef.current.forEach((group) => {
      sceneRef.current!.remove(group);
      disposeGroup(group);
    });
    universesRef.current.clear();

    // Remove and dispose old connection tubes
    const objectsToRemove: THREE.Object3D[] = [];
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry instanceof THREE.TubeGeometry) {
        objectsToRemove.push(object);
      }
    });
    objectsToRemove.forEach((object) => {
      sceneRef.current!.remove(object);
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });

    // Add new universes
    universes.forEach((universe) => {
      const group = createUniverse(universe);
      universesRef.current.set(universe.id, group);
      sceneRef.current!.add(group);

      // Add connections
      universe.connections.forEach((targetId) => {
        const targetUniverse = universes.find(u => u.id === targetId);
        if (targetUniverse) {
          const points = [];
          points.push(universe.position);

          const midPoint = new THREE.Vector3()
            .addVectors(universe.position, targetUniverse.position)
            .multiplyScalar(0.5);
          midPoint.y += 20;

          points.push(midPoint);
          points.push(targetUniverse.position);

          const curve = new THREE.QuadraticBezierCurve3(
            universe.position,
            midPoint,
            targetUniverse.position
          );

          const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.2, 8, false);
          const tubeMaterial = new THREE.MeshPhongMaterial({
            color: 0x4040ff,
            emissive: 0x2020ff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.5
          });
          const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
          sceneRef.current!.add(tube);
        }
      });
    });
  };

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !composerRef.current || !controlsRef.current) return;

    frameRef.current = requestAnimationFrame(animate);

    // Rotate universes
    universesRef.current.forEach((group) => {
      group.rotation.y += 0.005;
      if (group.children[2]) {
        group.children[2].rotation.z += 0.01; // Rotate ring
      }
    });

    controlsRef.current.update();
    composerRef.current.render();
  }, []);

  const makeChoice = (optionIndex: number) => {
    if (currentChoiceIndex >= LIFE_CHOICES.length) return;

    const choice = LIFE_CHOICES[currentChoiceIndex];
    const option = choice.options[optionIndex];

    // Create new universes based on choice
    const newUniverses: Universe[] = [];
    const baseStats = universes.length > 0 ? universes[0].stats : {
      career: 50,
      love: 50,
      wealth: 50,
      happiness: 50,
      health: 50
    };

    // Create universe for chosen path
    const chosenUniverse: Universe = {
      id: `universe-${Date.now()}-chosen`,
      timeline: [
        ...(universes[0]?.timeline || []),
        {
          age: choice.age,
          choice: option.text,
          event: `${choice.age}세: ${option.text}를 선택했습니다`
        }
      ],
      stats: {
        career: Math.min(100, Math.max(0, baseStats.career + option.consequences.career)),
        love: Math.min(100, Math.max(0, baseStats.love + option.consequences.love)),
        wealth: Math.min(100, Math.max(0, baseStats.wealth + option.consequences.wealth)),
        happiness: Math.min(100, Math.max(0, baseStats.happiness + option.consequences.happiness)),
        health: Math.min(100, Math.max(0, baseStats.health + option.consequences.health))
      },
      color: '#4080ff',
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        choice.age - 20,
        (Math.random() - 0.5) * 100
      ),
      connections: universes.map(u => u.id)
    };
    newUniverses.push(chosenUniverse);

    // Create alternate universes for other options
    choice.options.forEach((opt, idx) => {
      if (idx !== optionIndex) {
        const altUniverse: Universe = {
          id: `universe-${Date.now()}-alt-${idx}`,
          timeline: [
            ...(universes[0]?.timeline || []),
            {
              age: choice.age,
              choice: opt.text,
              event: `${choice.age}세: ${opt.text}를 선택했을 수도...`
            }
          ],
          stats: {
            career: Math.min(100, Math.max(0, baseStats.career + opt.consequences.career)),
            love: Math.min(100, Math.max(0, baseStats.love + opt.consequences.love)),
            wealth: Math.min(100, Math.max(0, baseStats.wealth + opt.consequences.wealth)),
            happiness: Math.min(100, Math.max(0, baseStats.happiness + opt.consequences.happiness)),
            health: Math.min(100, Math.max(0, baseStats.health + opt.consequences.health))
          },
          color: '#ff8040',
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 150,
            choice.age - 20,
            (Math.random() - 0.5) * 150
          ),
          connections: universes.map(u => u.id)
        };
        newUniverses.push(altUniverse);
      }
    });

    setUniverses([...universes, ...newUniverses]);
    setCurrentAge(choice.age);
    setCurrentChoiceIndex(currentChoiceIndex + 1);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentAge(0);
    setCurrentChoiceIndex(0);
    setUniverses([]);
    setSelectedUniverse(null);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentAge(0);
    setCurrentChoiceIndex(0);
    setUniverses([]);
    setSelectedUniverse(null);

    if (sceneRef.current) {
      // Dispose and remove universes
      universesRef.current.forEach((group) => {
        sceneRef.current!.remove(group);
        disposeGroup(group);
      });
      universesRef.current.clear();

      // Remove and dispose connection tubes
      const objectsToRemove: THREE.Object3D[] = [];
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh && object.geometry instanceof THREE.TubeGeometry) {
          objectsToRemove.push(object);
        }
      });
      objectsToRemove.forEach((object) => {
        sceneRef.current!.remove(object);
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    initThreeJS();
    animate();

    return () => {
      // Cancel animation frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }

      // Dispose OrbitControls
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      // Dispose EffectComposer and its render targets
      if (composerRef.current) {
        composerRef.current.renderTarget1?.dispose();
        composerRef.current.renderTarget2?.dispose();
      }

      // Dispose renderer and remove DOM element
      if (rendererRef.current) {
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }

      // Dispose all universes
      universesRef.current.forEach((group) => {
        disposeGroup(group);
      });
      universesRef.current.clear();

      // Dispose scene objects
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }

      // Dispose stars
      if (starsRef.current) {
        if (starsRef.current.geometry) {
          starsRef.current.geometry.dispose();
        }
        if (starsRef.current.material) {
          if (Array.isArray(starsRef.current.material)) {
            starsRef.current.material.forEach(material => material.dispose());
          } else {
            starsRef.current.material.dispose();
          }
        }
      }

      // Dispose timeline
      if (timelineRef.current) {
        if (timelineRef.current.geometry) {
          timelineRef.current.geometry.dispose();
        }
        if (timelineRef.current.material) {
          if (Array.isArray(timelineRef.current.material)) {
            timelineRef.current.material.forEach(material => material.dispose());
          } else {
            timelineRef.current.material.dispose();
          }
        }
      }

      // Clear refs
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      composerRef.current = null;
      starsRef.current = null;
      timelineRef.current = null;
    };
  }, [initThreeJS, animate]);

  useEffect(() => {
    updateUniverses();
  }, [universes]);

  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentChoice = currentChoiceIndex < LIFE_CHOICES.length ? LIFE_CHOICES[currentChoiceIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            평행우주 시뮬레이터
          </h1>
          <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            당신의 선택이 만드는 무한한 가능성의 우주
            <Globe className="w-5 h-5" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-blue-500/30">
              <CardContent className="p-0">
                <div
                  ref={mountRef}
                  className="w-full h-[600px] rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            {!isSimulating ? (
              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">시뮬레이션 시작</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-center">
                    인생의 중요한 순간마다 선택을 하고,
                    그 선택이 만들어내는 평행우주를 탐험해보세요.
                  </p>
                  <Button
                    onClick={startSimulation}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                  >
                    <Zap className="mr-2" />
                    시뮬레이션 시작
                  </Button>
                </CardContent>
              </Card>
            ) : currentChoice ? (
              <Card className="bg-slate-900/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>선택의 순간</span>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      {currentChoice.age}세
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-gray-200">{currentChoice.question}</p>
                  <div className="space-y-3">
                    {currentChoice.options.map((option, idx) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={idx}
                          onClick={() => makeChoice(idx)}
                          className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-left p-4"
                        >
                          <Icon className="mr-3 w-5 h-5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium">{option.text}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              커리어 {option.consequences.career > 0 ? '+' : ''}{option.consequences.career} |
                              사랑 {option.consequences.love > 0 ? '+' : ''}{option.consequences.love} |
                              부 {option.consequences.wealth > 0 ? '+' : ''}{option.consequences.wealth}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-center">시뮬레이션 완료</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-center">
                    모든 선택이 완료되었습니다.
                    3D 공간에서 당신의 평행우주들을 탐험해보세요.
                  </p>
                  <Button
                    onClick={resetSimulation}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Shuffle className="mr-2" />
                    다시 시작
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Universe Stats */}
            {universes.length > 0 && (
              <Card className="bg-slate-900/50 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-lg">우주 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">생성된 우주</span>
                      <span className="font-bold text-yellow-400">{universes.length}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">현재 나이</span>
                      <span className="font-bold text-cyan-400">{currentAge}세</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">남은 선택</span>
                      <span className="font-bold text-purple-400">
                        {Math.max(0, LIFE_CHOICES.length - currentChoiceIndex)}개
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Universe Details */}
            {selectedUniverse && (
              <Card className="bg-slate-900/50 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="text-lg">선택된 우주</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">커리어</div>
                        <div className="font-bold text-blue-400">{selectedUniverse.stats.career}%</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">사랑</div>
                        <div className="font-bold text-pink-400">{selectedUniverse.stats.love}%</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">부</div>
                        <div className="font-bold text-yellow-400">{selectedUniverse.stats.wealth}%</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="text-gray-400">행복</div>
                        <div className="font-bold text-green-400">{selectedUniverse.stats.happiness}%</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 max-h-32 overflow-y-auto">
                      {selectedUniverse.timeline.map((event, idx) => (
                        <div key={idx} className="mb-1">
                          • {event.event}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}