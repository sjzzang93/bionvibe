declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, MOUSE, Object3D, Vector3 } from 'three';

  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);

    object: Camera;
    domElement: HTMLElement | Document;

    // API
    enabled: boolean;
    target: Vector3;

    minDistance: number;
    maxDistance: number;

    minZoom: number;
    maxZoom: number;

    minPolarAngle: number;
    maxPolarAngle: number;

    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    enableDamping: boolean;
    dampingFactor: number;

    enableZoom: boolean;
    zoomSpeed: number;

    enableRotate: boolean;
    rotateSpeed: number;

    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;

    autoRotate: boolean;
    autoRotateSpeed: number;

    enableKeys: boolean;
    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };

    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };

    update(): void;

    saveState(): void;

    reset(): void;

    dispose(): void;

    getPolarAngle(): number;

    getAzimuthalAngle(): number;

    getDistance(): number;

    listenToKeyEvents(domElement: HTMLElement | Window): void;

    stopListenToKeyEvents(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer, WebGLRenderTarget } from 'three';

  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);

    renderer: WebGLRenderer;
    renderTarget1: WebGLRenderTarget;
    renderTarget2: WebGLRenderTarget;
    writeBuffer: WebGLRenderTarget;
    readBuffer: WebGLRenderTarget;
    passes: Pass[];
    copyPass: ShaderPass;

    swapBuffers(): void;
    addPass(pass: Pass): void;
    insertPass(pass: Pass, index: number): void;
    removePass(pass: Pass): void;
    isLastEnabledPass(passIndex: number): boolean;
    render(deltaTime?: number): void;
    reset(renderTarget?: WebGLRenderTarget): void;
    setSize(width: number, height: number): void;
    setPixelRatio(pixelRatio: number): void;
    dispose(): void;
  }

  export class Pass {
    constructor();

    enabled: boolean;
    needsSwap: boolean;
    clear: boolean;
    renderToScreen: boolean;

    setSize(width: number, height: number): void;
    render(
      renderer: WebGLRenderer,
      writeBuffer: WebGLRenderTarget,
      readBuffer: WebGLRenderTarget,
      deltaTime?: number,
      maskActive?: boolean
    ): void;
    dispose(): void;
  }

  export class ShaderPass extends Pass {
    constructor(shader: any, textureID?: string);

    textureID: string;
    uniforms: { [uniform: string]: any };
    material: any;
    fsQuad: FullScreenQuad;

    render(
      renderer: WebGLRenderer,
      writeBuffer: WebGLRenderTarget,
      readBuffer: WebGLRenderTarget,
      deltaTime?: number,
      maskActive?: boolean
    ): void;
  }

  export class FullScreenQuad {
    constructor(material?: any);

    render(renderer: WebGLRenderer): void;
    material: any;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera, Material, Color } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer';

  export class RenderPass extends Pass {
    constructor(
      scene: Scene,
      camera: Camera,
      overrideMaterial?: Material,
      clearColor?: Color,
      clearAlpha?: number
    );

    scene: Scene;
    camera: Camera;
    overrideMaterial?: Material;
    clearColor?: Color;
    clearAlpha: number;
    clearDepth: boolean;
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2, Vector3, WebGLRenderer, WebGLRenderTarget } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer';

  export class UnrealBloomPass extends Pass {
    constructor(resolution: Vector2, strength?: number, radius?: number, threshold?: number);

    resolution: Vector2;
    strength: number;
    radius: number;
    threshold: number;

    clearColor: Vector3;
    renderTargetsHorizontal: WebGLRenderTarget[];
    renderTargetsVertical: WebGLRenderTarget[];
    nMips: number;
    renderTargetBright: WebGLRenderTarget;
    highPassMaterial: any;
    compositeMaterial: any;
    separableBlurMaterials: any[];
    enabled: boolean;
    needsSwap: boolean;

    dispose(): void;
    setSize(width: number, height: number): void;
    render(
      renderer: WebGLRenderer,
      writeBuffer: WebGLRenderTarget,
      readBuffer: WebGLRenderTarget,
      deltaTime?: number,
      maskActive?: boolean
    ): void;

    getSeperableBlurMaterial(kernelRadius: number): any;
    getCompositeMaterial(nMips: number): any;
  }
}