import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Sparkles,
  Droplets,
  RotateCcw,
  Sun,
  Moon,
  Activity,
  ArrowDown,
  Info
} from 'lucide-react';
import sculptureAssetUrl from '../assets/sculpture.jpg';

interface LiquidSculptureHeroProps {
  onScrollToLab?: () => void;
  onOpenAbout?: () => void;
  roastMode?: boolean;
  prankMode?: boolean;
}

type ColorTheme = 'obsidian' | 'marble' | 'liquid-gold';

export const LiquidSculptureHero: React.FC<LiquidSculptureHeroProps> = ({
  onScrollToLab,
  onOpenAbout,
  roastMode = false,
  prankMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [particleCount, setParticleCount] = useState<number>(125000);
  const [fps, setFps] = useState<number>(60);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('obsidian');
  const [viscosityMode, setViscosityMode] = useState<'low' | 'fluid' | 'viscous'>('fluid');
  const [, setIsHovered] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Mouse & interaction state ref
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    isDown: false,
    radius: 0.32,
    strength: 1.0,
    swirl: 0.85,
    lastActive: 0,
  });

  // Animation and resources ref
  const animRef = useRef<{
    rafId: number;
    gl: WebGL2RenderingContext | null;
    program: WebGLProgram | null;
    positionBuffer: WebGLBuffer | null;
    colorBuffer: WebGLBuffer | null;
    sizeBuffer: WebGLBuffer | null;
    positions: Float32Array | null;
    colors: Float32Array | null;
    sizes: Float32Array | null;
    origins: Float32Array | null;
    velocities: Float32Array | null;
    totalParticles: number;
    rotationX: number;
    rotationY: number;
    targetRotationX: number;
    targetRotationY: number;
    lastFrameTime: number;
    frameCount: number;
    fpsTimer: number;
  }>({
    rafId: 0,
    gl: null,
    program: null,
    positionBuffer: null,
    colorBuffer: null,
    sizeBuffer: null,
    positions: null,
    colors: null,
    sizes: null,
    origins: null,
    velocities: null,
    totalParticles: 0,
    rotationX: 0,
    rotationY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    lastFrameTime: performance.now(),
    frameCount: 0,
    fpsTimer: performance.now(),
  });

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Vertex and Fragment Shaders for WebGL2 point sprites
  const vertexShaderSource = `#version 300 es
    precision highp float;

    in vec3 a_position;
    in vec3 a_color;
    in float a_size;

    uniform vec2 u_resolution;
    uniform mat4 u_transform;
    uniform float u_pointMultiplier;

    out vec3 v_color;
    out float v_depth;

    void main() {
      vec4 transformed = u_transform * vec4(a_position, 1.0);
      gl_Position = transformed;
      
      // Perspective size attenuation
      float depthScale = (1.0 + transformed.z * 0.45);
      gl_PointSize = clamp(a_size * u_pointMultiplier * depthScale, 1.0, 16.0);
      
      v_color = a_color;
      v_depth = transformed.z;
    }
  `;

  const fragmentShaderSource = `#version 300 es
    precision highp float;

    in vec3 v_color;
    in float v_depth;

    uniform float u_mode; // 0.0 obsidian bronze, 1.0 marble ivory, 2.0 liquid gold
    uniform float u_energy; // energetic pulse for roast/prank

    out vec4 fragColor;

    void main() {
      // Create smooth spherical point droplet
      vec2 coord = gl_PointCoord - vec2(0.5);
      float distSq = dot(coord, coord);
      if (distSq > 0.25) {
        discard;
      }

      // Normal map on point sphere for realistic specular highlight
      float r = sqrt(distSq) * 2.0;
      float z = sqrt(max(0.0, 1.0 - r * r));
      vec3 normal = normalize(vec3(coord * 2.0, z));
      vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
      
      // Specular highlight
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 18.0);
      float diffuse = max(dot(normal, lightDir), 0.25);

      vec3 finalColor = v_color * diffuse + vec3(spec * 0.75);

      // Warm refined tint based on theme
      if (u_mode > 1.5) {
        // Liquid Gold / Champagne
        finalColor += vec3(0.35, 0.24, 0.05) * spec;
      } else if (u_mode < 0.5) {
        // Obsidian Bronze / Deep Mocha Rim
        finalColor += vec3(0.12, 0.08, 0.04) * (1.0 - z);
      } else {
        // Carrara Marble: soft warm alabaster ivory
        finalColor += vec3(0.14, 0.11, 0.07) * diffuse;
      }

      if (u_energy > 0.1) {
        finalColor += vec3(u_energy * 0.22, u_energy * 0.12, u_energy * 0.04);
      }

      // Soft alpha edge for liquid drops
      float alpha = smoothstep(0.5, 0.2, sqrt(distSq));
      fragColor = vec4(finalColor, alpha * 0.95);
    }
  `;

  const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const createProgram = (gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) => {
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  };

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = animRef.current.gl;
    if (!canvas || !gl) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }, []);

  const initEngine = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      depth: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      console.warn('WebGL2 not supported, falling back to static presentation.');
      setIsSupported(false);
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) {
      setIsSupported(false);
      return;
    }

    const program = createProgram(gl, vs, fs);
    if (!program) {
      setIsSupported(false);
      return;
    }

    animRef.current.gl = gl;
    animRef.current.program = program;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sculptureAssetUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => {
        console.warn('Failed to load sculpture image asset.');
        resolve(null);
      };
    });

    const isMobile = window.innerWidth < 768;
    const gridDim = isMobile ? 250 : 354;
    const targetParticleCount = gridDim * gridDim;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = gridDim;
    offCanvas.height = gridDim;
    const offCtx = offCanvas.getContext('2d');

    if (offCtx && img.naturalWidth > 0) {
      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, gridDim, gridDim);
      offCtx.drawImage(img, 0, 0, gridDim, gridDim);
    } else if (offCtx) {
      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, gridDim, gridDim);
      offCtx.fillStyle = '#FFFFFF';
      offCtx.beginPath();
      offCtx.arc(gridDim * 0.5, gridDim * 0.38, gridDim * 0.22, 0, Math.PI * 2);
      offCtx.fill();
      offCtx.beginPath();
      offCtx.ellipse(gridDim * 0.5, gridDim * 0.72, gridDim * 0.35, gridDim * 0.28, 0, 0, Math.PI * 2);
      offCtx.fill();
    }

    const imgData = offCtx ? offCtx.getImageData(0, 0, gridDim, gridDim).data : null;

    const positions = new Float32Array(targetParticleCount * 3);
    const origins = new Float32Array(targetParticleCount * 3);
    const velocities = new Float32Array(targetParticleCount * 3);
    const colors = new Float32Array(targetParticleCount * 3);
    const sizes = new Float32Array(targetParticleCount);

    let validCount = 0;

    for (let y = 0; y < gridDim; y++) {
      for (let x = 0; x < gridDim; x++) {
        const pixelIdx = (y * gridDim + x) * 4;
        let r = 0.88;
        let g = 0.85;
        let b = 0.80;
        let lum = 0.5;

        if (imgData) {
          r = imgData[pixelIdx] / 255;
          g = imgData[pixelIdx + 1] / 255;
          b = imgData[pixelIdx + 2] / 255;
          lum = 0.299 * r + 0.587 * g + 0.114 * b;
        }

        const nx = (x / (gridDim - 1)) * 1.9 - 0.95;
        const ny = -((y / (gridDim - 1)) * 1.9 - 0.95);
        const nz = (lum - 0.25) * 0.75;

        const pSize = lum > 0.15 ? 1.8 + lum * 1.8 : 0.8;
        const i3 = validCount * 3;

        origins[i3] = nx;
        origins[i3 + 1] = ny;
        origins[i3 + 2] = nz;

        positions[i3] = nx + (Math.random() - 0.5) * 0.05;
        positions[i3 + 1] = ny + (Math.random() - 0.5) * 0.05;
        positions[i3 + 2] = nz + (Math.random() - 0.5) * 0.05;

        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;

        // Warm bronze & alabaster shade
        colors[i3] = Math.max(0.18, r * 1.15);
        colors[i3 + 1] = Math.max(0.15, g * 1.05);
        colors[i3 + 2] = Math.max(0.12, b * 0.95);

        sizes[validCount] = pSize;
        validCount++;
      }
    }

    setParticleCount(validCount);

    animRef.current.totalParticles = validCount;
    animRef.current.positions = positions;
    animRef.current.origins = origins;
    animRef.current.velocities = velocities;
    animRef.current.colors = colors;
    animRef.current.sizes = sizes;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    animRef.current.positionBuffer = posBuffer;

    const colBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    animRef.current.colorBuffer = colBuffer;

    const szBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, szBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    animRef.current.sizeBuffer = szBuffer;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    handleResize();
  }, [handleResize]);

  const triggerBurst = () => {
    setHasInteracted(true);
    const { totalParticles, velocities, positions, origins } = animRef.current;
    if (!velocities || !positions || !origins) return;

    for (let i = 0; i < totalParticles; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const force = 0.03 + Math.random() * 0.05;
      velocities[i3] += Math.cos(angle) * force;
      velocities[i3 + 1] += Math.sin(angle) * force;
      velocities[i3 + 2] += (Math.random() - 0.5) * force;
    }
  };

  const triggerReconstitute = () => {
    const { totalParticles, velocities, positions, origins } = animRef.current;
    if (!velocities || !positions || !origins) return;

    for (let i = 0; i < totalParticles; i++) {
      const i3 = i * 3;
      velocities[i3] *= 0.1;
      velocities[i3 + 1] *= 0.1;
      velocities[i3 + 2] *= 0.1;
      positions[i3] = origins[i3];
      positions[i3 + 1] = origins[i3 + 1];
      positions[i3 + 2] = origins[i3 + 2];
    }
  };

  useEffect(() => {
    initEngine();
    window.addEventListener('resize', handleResize);

    let isRunning = true;

    const render = (time: number) => {
      if (!isRunning) return;

      const gl = animRef.current.gl;
      const program = animRef.current.program;
      const canvas = canvasRef.current;

      if (!gl || !program || !canvas) {
        animRef.current.rafId = requestAnimationFrame(render);
        return;
      }

      animRef.current.frameCount++;
      if (time - animRef.current.fpsTimer > 1000) {
        setFps(Math.round((animRef.current.frameCount * 1000) / (time - animRef.current.fpsTimer)));
        animRef.current.frameCount = 0;
        animRef.current.fpsTimer = time;
      }

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      animRef.current.rotationX += (animRef.current.targetRotationX - animRef.current.rotationX) * 0.05;
      animRef.current.rotationY += (animRef.current.targetRotationY - animRef.current.rotationY) * 0.05;

      let damping = 0.89;
      let spring = 0.038;
      let interactionRadius = 0.35;
      let swirlForce = 0.8;

      if (viscosityMode === 'low') {
        damping = 0.94;
        spring = 0.025;
        interactionRadius = 0.42;
        swirlForce = 1.1;
      } else if (viscosityMode === 'viscous') {
        damping = 0.82;
        spring = 0.055;
        interactionRadius = 0.28;
        swirlForce = 0.5;
      }

      const {
        totalParticles,
        positions,
        origins,
        velocities,
        positionBuffer,
      } = animRef.current;

      const tSec = time * 0.001;

      if (positions && origins && velocities && !prefersReducedMotion) {
        const mx = mouse.x;
        const my = mouse.y;
        const hasPointer = mx > -9000;
        const isDown = mouse.isDown;
        const radiusSq = interactionRadius * interactionRadius;

        for (let i = 0; i < totalParticles; i++) {
          const i3 = i * 3;

          let px = positions[i3];
          let py = positions[i3 + 1];
          let pz = positions[i3 + 2];

          const ox = origins[i3];
          const oy = origins[i3 + 1];
          const oz = origins[i3 + 2];

          let vx = velocities[i3];
          let vy = velocities[i3 + 1];
          let vz = velocities[i3 + 2];

          const dxOrigin = ox - px;
          const dyOrigin = oy - py;
          const dzOrigin = oz - pz;

          vx += dxOrigin * spring;
          vy += dyOrigin * spring;
          vz += dzOrigin * spring;

          const ambientWave = Math.sin(tSec * 1.5 + ox * 4.0 + oy * 3.0) * 0.0004;
          vx += ambientWave * 0.5;
          vy += ambientWave;

          if (hasPointer) {
            const dx = px - mx;
            const dy = py - my;
            const distSq = dx * dx + dy * dy;

            if (distSq < radiusSq && distSq > 0.0001) {
              const dist = Math.sqrt(distSq);
              const normDist = 1.0 - dist / interactionRadius;
              const strength = normDist * normDist * (isDown ? 0.06 : 0.025);

              const nx = dx / dist;
              const ny = dy / dist;

              vx += nx * strength;
              vy += ny * strength;
              vz += (Math.random() - 0.5) * strength * 0.8;

              const swirl = swirlForce * strength * 1.5;
              vx += -ny * swirl;
              vy += nx * swirl;
            }
          }

          vx *= damping;
          vy *= damping;
          vz *= damping;

          px += vx;
          py += vy;
          pz += vz;

          positions[i3] = px;
          positions[i3 + 1] = py;
          positions[i3 + 2] = pz;
          velocities[i3] = vx;
          velocities[i3 + 1] = vy;
          velocities[i3 + 2] = vz;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      const rotX = animRef.current.rotationX;
      const rotY = animRef.current.rotationY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const aspect = canvas.width / canvas.height;
      const scaleX = aspect > 1 ? 1 / aspect : 1.0;
      const scaleY = aspect > 1 ? 1.0 : aspect;

      const transformMatrix = new Float32Array([
        cosY * scaleX, sinX * sinY * scaleX, cosX * sinY * scaleX, 0,
        0, cosX * scaleY, -sinX * scaleY, 0,
        -sinY, sinX * cosY, cosX * cosY, 0,
        0, 0, 0, 1
      ]);

      const uTransformLoc = gl.getUniformLocation(program, 'u_transform');
      gl.uniformMatrix4fv(uTransformLoc, false, transformMatrix);

      const uPointMultLoc = gl.getUniformLocation(program, 'u_pointMultiplier');
      gl.uniform1f(uPointMultLoc, (canvas.height / 700) * (window.devicePixelRatio || 1));

      const uModeLoc = gl.getUniformLocation(program, 'u_mode');
      const modeVal = colorTheme === 'obsidian' ? 0.0 : colorTheme === 'marble' ? 1.0 : 2.0;
      gl.uniform1f(uModeLoc, modeVal);

      const uEnergyLoc = gl.getUniformLocation(program, 'u_energy');
      gl.uniform1f(uEnergyLoc, roastMode ? 0.8 : prankMode ? 1.0 : 0.0);

      const aPosLoc = gl.getAttribLocation(program, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, animRef.current.positionBuffer);
      gl.enableVertexAttribArray(aPosLoc);
      gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0);

      const aColLoc = gl.getAttribLocation(program, 'a_color');
      gl.bindBuffer(gl.ARRAY_BUFFER, animRef.current.colorBuffer);
      gl.enableVertexAttribArray(aColLoc);
      gl.vertexAttribPointer(aColLoc, 3, gl.FLOAT, false, 0, 0);

      const aSizeLoc = gl.getAttribLocation(program, 'a_size');
      gl.bindBuffer(gl.ARRAY_BUFFER, animRef.current.sizeBuffer);
      gl.enableVertexAttribArray(aSizeLoc);
      gl.vertexAttribPointer(aSizeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, totalParticles);

      animRef.current.rafId = requestAnimationFrame(render);
    };

    animRef.current.rafId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animRef.current.rafId);
      const gl = animRef.current.gl;
      if (gl) {
        if (animRef.current.positionBuffer) gl.deleteBuffer(animRef.current.positionBuffer);
        if (animRef.current.colorBuffer) gl.deleteBuffer(animRef.current.colorBuffer);
        if (animRef.current.sizeBuffer) gl.deleteBuffer(animRef.current.sizeBuffer);
        if (animRef.current.program) gl.deleteProgram(animRef.current.program);
      }
    };
  }, [initEngine, handleResize, colorTheme, viscosityMode, prefersReducedMotion, roastMode, prankMode]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mouseRef.current.targetX = nx;
    mouseRef.current.targetY = ny;
    mouseRef.current.lastActive = performance.now();

    animRef.current.targetRotationY = nx * 0.35;
    animRef.current.targetRotationX = -ny * 0.25;

    if (!hasInteracted) setHasInteracted(true);
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = -9999;
    mouseRef.current.targetY = -9999;
    mouseRef.current.isDown = false;
    animRef.current.targetRotationX = 0;
    animRef.current.targetRotationY = 0;
    setIsHovered(false);
  };

  const handlePointerDown = () => {
    mouseRef.current.isDown = true;
    if (!hasInteracted) setHasInteracted(true);
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
      animRef.current.targetRotationY = nx * 0.4;
      animRef.current.targetRotationX = -ny * 0.3;
      if (!hasInteracted) setHasInteracted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl bg-[#FFFFFF] dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] shadow-sm dark:shadow-2xl transition-colors duration-200"
    >
      {/* Background warm ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8C5E3C]/5 dark:bg-[#C99765]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FAF7F2]/50 dark:bg-[#171311]/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid: Editorial Typography Left + Interactive Liquid Sculpture Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-12">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Unboxed Metadata Line (Anti-Slop Zero Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
            <span className="font-semibold text-[#8C5E3C] dark:text-[#C99765] uppercase tracking-wider text-[11px]">
              School Exhibition Project
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#211813] dark:text-[#F5EFEB]">By Andrew & Apeksha</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{Math.round(particleCount / 1000)}k Fluid Particles</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Activity className="w-3 h-3 text-[#8C5E3C] dark:text-[#C99765]" />
              {fps} FPS
            </span>
          </div>

          {/* High-Fashion Editorial Headline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C5E3C] dark:text-[#C99765] font-semibold">
                AI-Powered Visual Analysis Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-normal tracking-tight text-[#211813] dark:text-[#F5EFEB] leading-[1.08]">
              ANDESHA
            </h1>
            <p className="text-lg sm:text-xl font-editorial italic text-[#8C5E3C] dark:text-[#C99765] leading-snug">
              “See Beyond the Image. Understand the Data.”
            </p>
            <p className="text-[#5C4E43] dark:text-[#D4C7BC] text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
              An interactive school exhibition project created by Andrew & Apeksha. Discover how artificial intelligence analyzes portraits side-by-side across 8 photographic dimensions — turning visual perception into transparent, probabilistic data.
            </p>
          </div>

          {/* Interactive Controls Toolbar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Color Theme Selector */}
            <div className="bg-[#F4EFEA] dark:bg-[#2B231F] p-1 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] flex items-center space-x-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setColorTheme('obsidian')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 font-sans ${
                  colorTheme === 'obsidian'
                    ? 'bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] text-[#211813] dark:text-[#F5EFEB] shadow-xs'
                    : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
                }`}
                title="Obsidian Bronze: Deep metallic liquid finish"
              >
                <Moon className="w-3 h-3 text-[#8C5E3C] dark:text-[#C99765]" />
                <span>Obsidian</span>
              </button>

              <button
                type="button"
                onClick={() => setColorTheme('marble')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 font-sans ${
                  colorTheme === 'marble'
                    ? 'bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] text-[#211813] dark:text-[#F5EFEB] shadow-xs'
                    : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
                }`}
                title="Carrara Marble: Classical luminescent alabaster"
              >
                <Sun className="w-3 h-3 text-[#8C5E3C] dark:text-[#C99765]" />
                <span>Marble</span>
              </button>

              <button
                type="button"
                onClick={() => setColorTheme('liquid-gold')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 font-sans ${
                  colorTheme === 'liquid-gold'
                    ? 'bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] text-[#211813] dark:text-[#F5EFEB] shadow-xs'
                    : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
                }`}
                title="Liquid Gold: Solar metallic luster"
              >
                <Sparkles className="w-3 h-3 text-[#8C5E3C] dark:text-[#C99765]" />
                <span>Gold</span>
              </button>
            </div>

            {/* Viscosity Toggle */}
            <div className="bg-[#F4EFEA] dark:bg-[#2B231F] p-1 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] flex items-center space-x-1 shadow-2xs">
              {(['low', 'fluid', 'viscous'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setViscosityMode(v)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono capitalize transition cursor-pointer ${
                    viscosityMode === v
                      ? 'bg-white dark:bg-[#1E1815] text-[#211813] dark:text-[#F5EFEB] border border-[#E8E2D8] dark:border-[#3D332C] shadow-xs font-semibold'
                      : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
                  }`}
                  title={`${v} fluid dynamic response`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Fluid Burst & Reconstitute Buttons */}
            <button
              type="button"
              onClick={triggerBurst}
              className="p-2 rounded-lg bg-[#F4EFEA] hover:bg-[#EAE4DC] dark:bg-[#2B231F] dark:hover:bg-[#382F2A] border border-[#E8E2D8] dark:border-[#3D332C] text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] transition cursor-pointer flex items-center gap-1 text-xs font-medium shadow-2xs font-sans"
              title="Disperse particles into fluid wake"
            >
              <Droplets className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
              <span>Splash</span>
            </button>

            <button
              type="button"
              onClick={triggerReconstitute}
              className="p-2 rounded-lg bg-[#F4EFEA] hover:bg-[#EAE4DC] dark:bg-[#2B231F] dark:hover:bg-[#382F2A] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB] transition cursor-pointer shadow-2xs"
              title="Snap sculpture back into solid form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Call to Comparison Lab */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (onScrollToLab) {
                  onScrollToLab();
                } else {
                  const elem = document.getElementById('comparison-lab-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-5 py-3 rounded-lg bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] font-medium text-xs tracking-wider uppercase transition shadow-sm hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer group font-sans"
            >
              <span>Explore ANDESHA Lab</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            {onOpenAbout && (
              <button
                type="button"
                onClick={onOpenAbout}
                className="px-4 py-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#2B231F] dark:hover:bg-[#382F2A] border border-[#E8E2D8] dark:border-[#3D332C] text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] font-medium text-xs tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 font-sans shadow-2xs"
              >
                <Info className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
                <span>About Creators</span>
              </button>
            )}

            <div className="text-[11px] text-[#8C7D70] dark:text-[#A69688] flex items-center gap-2 font-sans">
              <span>Bradley–Terry Model</span>
              <span aria-hidden="true">·</span>
              <span>8 Visual Axes</span>
            </div>
          </div>
        </div>

        {/* Right Column: WebGL2 Interactive Liquid Sculpture Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div
            className="w-full max-w-[500px] aspect-square relative rounded-xl overflow-hidden cursor-crosshair select-none bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] shadow-lg group"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onMouseEnter={() => setIsHovered(true)}
            onTouchMove={handleTouchMove}
          >
            {isSupported && !prefersReducedMotion ? (
              <canvas
                ref={canvasRef}
                className="w-full h-full block touch-none"
              />
            ) : (
              <div className="w-full h-full relative flex items-center justify-center bg-[#171311] p-6">
                <img
                  src={sculptureAssetUrl}
                  alt="Neoclassical Bust Sculpture"
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#1E1815]/95 border border-[#E8E2D8] dark:border-[#3D332C] p-2.5 rounded-lg backdrop-blur-md text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765] shrink-0" />
                  <span>
                    {prefersReducedMotion
                      ? 'Static sculpture view active (reduced-motion requested)'
                      : 'High-resolution static presentation'}
                  </span>
                </div>
              </div>
            )}

            {/* Interaction Hint Overlay */}
            {!hasInteracted && isSupported && !prefersReducedMotion && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-700">
                <div className="px-4 py-2 rounded-full bg-[#1E1815]/95 border border-[#C99765]/40 text-[#F5EFEB] text-xs font-mono font-medium tracking-wide shadow-xl flex items-center gap-2 animate-bounce">
                  <Droplets className="w-3.5 h-3.5 text-[#C99765]" />
                  <span>Hover or drag across sculpture to fluidize</span>
                </div>
              </div>
            )}

            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4C7BC] bg-[#171311]/85 px-2 py-0.5 rounded border border-[#3D332C]">
                WebGL2 · ~{Math.round(particleCount / 1000)}k pts
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between w-full max-w-[500px] text-[11px] text-[#8C7D70] dark:text-[#A69688] px-2 font-sans">
            <span>Real-time Fluid Dynamics (Vorticity + Spring Return)</span>
            <span className="font-mono">3D Depth Relief</span>
          </div>
        </div>
      </div>
    </div>
  );
};
