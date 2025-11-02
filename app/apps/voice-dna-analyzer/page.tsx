'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Volume2, Dna, Sparkles, Activity, Zap, Brain, Heart, Shield } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

interface VoiceProfile {
  pitch: number;
  tone: number;
  speed: number;
  emotion: number;
  confidence: number;
  uniqueness: number;
}

interface VoicePersonality {
  type: string;
  description: string;
  strengths: string[];
  color: string;
  icon: any;
}

interface DNANode {
  position: THREE.Vector3;
  color: string;
  size: number;
  frequency: number;
  amplitude: number;
}

const VOICE_PERSONALITIES: VoicePersonality[] = [
  {
    type: '리더형',
    description: '강력하고 자신감 있는 목소리로 사람들을 이끕니다',
    strengths: ['설득력', '카리스마', '결단력'],
    color: '#ff6b6b',
    icon: Zap
  },
  {
    type: '공감형',
    description: '따뜻하고 부드러운 목소리로 마음을 어루만집니다',
    strengths: ['친화력', '경청', '위로'],
    color: '#4ecdc4',
    icon: Heart
  },
  {
    type: '분석형',
    description: '차분하고 논리적인 목소리로 신뢰를 줍니다',
    strengths: ['논리성', '정확성', '신뢰도'],
    color: '#45b7d1',
    icon: Brain
  },
  {
    type: '창의형',
    description: '독특하고 개성 있는 목소리로 주목을 끕니다',
    strengths: ['독창성', '표현력', '상상력'],
    color: '#f7b731',
    icon: Sparkles
  },
  {
    type: '안정형',
    description: '일관되고 믿음직한 목소리로 안정감을 줍니다',
    strengths: ['일관성', '신뢰성', '인내심'],
    color: '#5f27cd',
    icon: Shield
  }
];

export default function VoiceDNAAnalyzer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dnaGroupRef = useRef<THREE.Group | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [voicePersonality, setVoicePersonality] = useState<VoicePersonality | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [dnaNodes, setDnaNodes] = useState<DNANode[]>([]);

  const initThreeJS = useCallback(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.002);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);
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
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffff00, 1, 100);
    pointLight3.position.set(0, 0, -30);
    scene.add(pointLight3);

    // Create DNA group
    const dnaGroup = new THREE.Group();
    dnaGroupRef.current = dnaGroup;
    scene.add(dnaGroup);

    // Add particles for background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particlesVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      particlesVertices.push(x, y, z);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    return () => {
      // Cleanup Three.js resources
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of all geometries and materials in the scene
      if (scene) {
        scene.traverse((object) => {
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
          if (object instanceof THREE.Points) {
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
        scene.clear();
      }

      // Dispose of controls
      if (controls) {
        controls.dispose();
      }

      // Dispose of composer
      if (composer) {
        composer.dispose();
      }

      // Dispose of renderer
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  const createDNAHelix = useCallback((frequencyData: Uint8Array) => {
    if (!dnaGroupRef.current) return;

    // Clear existing DNA with proper disposal
    while (dnaGroupRef.current.children.length > 0) {
      const child = dnaGroupRef.current.children[0];
      if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
      dnaGroupRef.current.remove(child);
    }

    const nodes: DNANode[] = [];
    const helixHeight = 40;
    const helixRadius = 10;
    const segments = 64;

    // Create double helix structure
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const angle1 = t * Math.PI * 8;
      const angle2 = angle1 + Math.PI;
      const y = (t - 0.5) * helixHeight;

      const freqIndex = Math.floor((i / segments) * frequencyData.length);
      const amplitude = frequencyData[freqIndex] / 255;

      // First strand
      const x1 = Math.cos(angle1) * helixRadius * (1 + amplitude * 0.5);
      const z1 = Math.sin(angle1) * helixRadius * (1 + amplitude * 0.5);

      // Second strand
      const x2 = Math.cos(angle2) * helixRadius * (1 + amplitude * 0.5);
      const z2 = Math.sin(angle2) * helixRadius * (1 + amplitude * 0.5);

      // Create nodes for strands
      const node1: DNANode = {
        position: new THREE.Vector3(x1, y, z1),
        color: `hsl(${(t * 360) % 360}, 100%, 50%)`,
        size: 1 + amplitude * 2,
        frequency: freqIndex,
        amplitude: amplitude
      };

      const node2: DNANode = {
        position: new THREE.Vector3(x2, y, z2),
        color: `hsl(${((t * 360) + 180) % 360}, 100%, 50%)`,
        size: 1 + amplitude * 2,
        frequency: freqIndex,
        amplitude: amplitude
      };

      nodes.push(node1, node2);

      // Create sphere for node1
      const geometry1 = new THREE.SphereGeometry(node1.size * 0.3, 16, 16);
      const material1 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(node1.color),
        emissive: new THREE.Color(node1.color),
        emissiveIntensity: 0.5
      });
      const sphere1 = new THREE.Mesh(geometry1, material1);
      sphere1.position.copy(node1.position);
      dnaGroupRef.current.add(sphere1);

      // Create sphere for node2
      const geometry2 = new THREE.SphereGeometry(node2.size * 0.3, 16, 16);
      const material2 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(node2.color),
        emissive: new THREE.Color(node2.color),
        emissiveIntensity: 0.5
      });
      const sphere2 = new THREE.Mesh(geometry2, material2);
      sphere2.position.copy(node2.position);
      dnaGroupRef.current.add(sphere2);

      // Create connection between strands
      if (i % 4 === 0) {
        const connectionGeometry = new THREE.CylinderGeometry(0.1, 0.1, node1.position.distanceTo(node2.position));
        const connectionMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.6
        });
        const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);

        connection.position.copy(node1.position);
        connection.position.add(node2.position);
        connection.position.multiplyScalar(0.5);

        connection.lookAt(node2.position);
        connection.rotateX(Math.PI / 2);

        dnaGroupRef.current.add(connection);
      }
    }

    // Create backbone curves
    const curve1Points = [];
    const curve2Points = [];
    for (let i = 0; i < nodes.length; i += 2) {
      curve1Points.push(nodes[i].position);
      if (i + 1 < nodes.length) {
        curve2Points.push(nodes[i + 1].position);
      }
    }

    if (curve1Points.length > 2) {
      const curve1 = new THREE.CatmullRomCurve3(curve1Points);
      const tubeGeometry1 = new THREE.TubeGeometry(curve1, 100, 0.2, 8, false);
      const tubeMaterial1 = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const tube1 = new THREE.Mesh(tubeGeometry1, tubeMaterial1);
      dnaGroupRef.current.add(tube1);
    }

    if (curve2Points.length > 2) {
      const curve2 = new THREE.CatmullRomCurve3(curve2Points);
      const tubeGeometry2 = new THREE.TubeGeometry(curve2, 100, 0.2, 8, false);
      const tubeMaterial2 = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const tube2 = new THREE.Mesh(tubeGeometry2, tubeMaterial2);
      dnaGroupRef.current.add(tube2);
    }

    setDnaNodes(nodes);
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !composerRef.current || !controlsRef.current) return;

    frameRef.current = requestAnimationFrame(animate);

    // Rotate DNA
    if (dnaGroupRef.current) {
      dnaGroupRef.current.rotation.y += 0.005;
    }

    // Update frequency visualization if recording
    if (isRecording && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setFrequencyData(dataArray);
      createDNAHelix(dataArray);
    }

    controlsRef.current.update();
    composerRef.current.render();
  }, [isRecording, createDNAHelix]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      source.connect(analyser);

      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsed);

        if (elapsed >= 10) {
          stopRecording();
          clearInterval(timerInterval);
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Simulate analysis
    setTimeout(() => {
      analyzeVoice();
    }, 2000);
  };

  const analyzeVoice = () => {
    // Generate voice profile based on actual frequency data
    let profile: VoiceProfile;

    if (analyserRef.current && frequencyData) {
      // Use actual frequency data from recording
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate actual audio metrics
      const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const maxFrequency = Math.max(...Array.from(dataArray));
      const minFrequency = Math.min(...Array.from(dataArray).filter(v => v > 0));

      // Split into frequency bands
      const lowFreqEnd = Math.floor(dataArray.length / 3);
      const midFreqEnd = Math.floor(2 * dataArray.length / 3);

      const lowFreq = dataArray.slice(0, lowFreqEnd).reduce((sum, val) => sum + val, 0) / lowFreqEnd;
      const midFreq = dataArray.slice(lowFreqEnd, midFreqEnd).reduce((sum, val) => sum + val, 0) / (midFreqEnd - lowFreqEnd);
      const highFreq = dataArray.slice(midFreqEnd).reduce((sum, val) => sum + val, 0) / (dataArray.length - midFreqEnd);

      // Calculate variance for uniqueness
      const variance = dataArray.reduce((sum, val) => sum + Math.pow(val - avgFrequency, 2), 0) / dataArray.length;
      const stdDev = Math.sqrt(variance);

      profile = {
        pitch: Math.min(100, (highFreq / 255) * 100),
        tone: Math.min(100, (midFreq / 255) * 100),
        speed: Math.min(100, (avgFrequency / 255) * 100),
        emotion: Math.min(100, ((maxFrequency - avgFrequency) / 255) * 100),
        confidence: Math.min(100, (lowFreq / 255) * 100),
        uniqueness: Math.min(100, (stdDev / 255) * 100)
      };
    } else {
      // Fallback to random data if no frequency data available
      profile = {
        pitch: Math.random() * 100,
        tone: Math.random() * 100,
        speed: Math.random() * 100,
        emotion: Math.random() * 100,
        confidence: Math.random() * 100,
        uniqueness: Math.random() * 100
      };
    }

    setVoiceProfile(profile);

    // Determine personality type
    const avgScore = (profile.pitch + profile.tone + profile.speed + profile.emotion + profile.confidence) / 5;
    let personalityIndex = 0;

    if (profile.confidence > 70 && profile.pitch > 60) {
      personalityIndex = 0; // Leader
    } else if (profile.emotion > 70 && profile.tone > 60) {
      personalityIndex = 1; // Empathetic
    } else if (profile.speed < 40 && profile.tone < 50) {
      personalityIndex = 2; // Analytical
    } else if (profile.uniqueness > 70) {
      personalityIndex = 3; // Creative
    } else {
      personalityIndex = 4; // Stable
    }

    setVoicePersonality(VOICE_PERSONALITIES[personalityIndex]);
    setIsAnalyzing(false);

    // Create final DNA visualization with random data
    const finalData = new Uint8Array(128);
    for (let i = 0; i < finalData.length; i++) {
      finalData[i] = Math.random() * 255;
    }
    createDNAHelix(finalData);
  };

  const reset = () => {
    // Stop recording if active
    if (isRecording) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }

    setIsRecording(false);
    setIsAnalyzing(false);
    setVoiceProfile(null);
    setVoicePersonality(null);
    setRecordingTime(0);
    setFrequencyData(null);
    setDnaNodes([]);

    // Clear DNA with proper disposal
    if (dnaGroupRef.current) {
      while (dnaGroupRef.current.children.length > 0) {
        const child = dnaGroupRef.current.children[0];
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
        dnaGroupRef.current.remove(child);
      }
    }

    analyserRef.current = null;
  };

  useEffect(() => {
    const cleanup = initThreeJS();
    animate();

    return () => {
      // Cancel animation frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      // Cleanup Web Audio API resources
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      analyserRef.current = null;

      // Cleanup Three.js
      cleanup?.();
    };
  }, [initThreeJS, animate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            목소리 DNA 분석기
          </h1>
          <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
            <Dna className="w-5 h-5" />
            당신의 목소리에 담긴 고유한 DNA를 발견하세요
            <Activity className="w-5 h-5" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-purple-500/30">
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
            {!voiceProfile ? (
              <Card className="bg-gray-900/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">음성 녹음</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isRecording && !isAnalyzing ? (
                    <>
                      <p className="text-gray-300 text-center">
                        10초 동안 자연스럽게 말씀해주세요.
                        당신의 목소리 DNA를 분석해드립니다.
                      </p>
                      <Button
                        onClick={startRecording}
                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-lg py-6"
                      >
                        <Mic className="mr-2" />
                        녹음 시작
                      </Button>
                    </>
                  ) : isRecording ? (
                    <>
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <Mic className="w-16 h-16 text-red-500 animate-pulse" />
                            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-red-400">
                          녹음 중... {recordingTime}초 / 10초
                        </p>
                        <Progress value={(recordingTime / 10) * 100} className="w-full" />
                        <Button
                          onClick={stopRecording}
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <MicOff className="mr-2" />
                          녹음 중지
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <Brain className="w-16 h-16 text-purple-500 animate-pulse" />
                      </div>
                      <p className="text-xl font-medium">목소리 DNA 분석 중...</p>
                      <Progress value={100} className="w-full animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-gray-900/50 border-pink-500/30">
                  <CardHeader>
                    <CardTitle className="text-xl">분석 결과</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {voicePersonality && (
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          {(() => {
                            const Icon = voicePersonality.icon;
                            return <Icon className="w-12 h-12" style={{ color: voicePersonality.color }} />;
                          })()}
                        </div>
                        <h3 className="text-2xl font-bold" style={{ color: voicePersonality.color }}>
                          {voicePersonality.type}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {voicePersonality.description}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {voicePersonality.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="border-purple-500/50">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg">음성 DNA 프로필</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">음높이</span>
                          <span className="text-cyan-400">{Math.round(voiceProfile.pitch)}%</span>
                        </div>
                        <Progress value={voiceProfile.pitch} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">음색</span>
                          <span className="text-purple-400">{Math.round(voiceProfile.tone)}%</span>
                        </div>
                        <Progress value={voiceProfile.tone} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">속도</span>
                          <span className="text-blue-400">{Math.round(voiceProfile.speed)}%</span>
                        </div>
                        <Progress value={voiceProfile.speed} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">감정</span>
                          <span className="text-pink-400">{Math.round(voiceProfile.emotion)}%</span>
                        </div>
                        <Progress value={voiceProfile.emotion} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">자신감</span>
                          <span className="text-yellow-400">{Math.round(voiceProfile.confidence)}%</span>
                        </div>
                        <Progress value={voiceProfile.confidence} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">독특함</span>
                          <span className="text-green-400">{Math.round(voiceProfile.uniqueness)}%</span>
                        </div>
                        <Progress value={voiceProfile.uniqueness} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Volume2 className="mr-2" />
                  다시 분석하기
                </Button>
              </>
            )}

            {/* Instructions */}
            {!voiceProfile && !isRecording && !isAnalyzing && (
              <Card className="bg-gray-900/50 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-sm">사용 방법</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm text-gray-400 space-y-1">
                    <li>1. 조용한 환경에서 준비해주세요</li>
                    <li>2. 녹음 버튼을 누르고 자연스럽게 말하세요</li>
                    <li>3. 10초 동안 녹음이 진행됩니다</li>
                    <li>4. AI가 당신의 목소리 DNA를 분석합니다</li>
                    <li>5. 3D로 시각화된 결과를 확인하세요</li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}