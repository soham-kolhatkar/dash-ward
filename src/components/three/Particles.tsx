import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ScenePalette } from './Orb'

const vertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uPointer;
uniform float uScroll;
attribute vec4 aSeed;
attribute float aRing;
varying float vMix;
varying float vAlpha;

void main(){
  vec3 p = position;
  float t = uTime;
  if (aRing > 0.5) {
    float r = length(p.xz);
    float ang = atan(p.z, p.x) + t * (0.35 / r) + uScroll * 1.2;
    p.x = cos(ang) * r;
    p.z = sin(ang) * r;
    p.y += sin(ang * 3.0 + aSeed.x * 6.28) * 0.06;
    // tilt the ring
    float c = cos(0.42), s = sin(0.42);
    p = vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
    float c2 = cos(-0.25), s2 = sin(-0.25);
    p = vec3(p.x * c2 - p.y * s2, p.x * s2 + p.y * c2, p.z);
  } else {
    p.x += sin(t * (0.12 + aSeed.x * 0.2) + aSeed.y * 6.28) * 0.35;
    p.y += cos(t * (0.1 + aSeed.y * 0.18) + aSeed.z * 6.28) * 0.3 + uScroll * (1.0 + aSeed.w) * 1.4;
    p.z += sin(t * 0.08 + aSeed.w * 6.28) * 0.25;
  }

  vec2 d = p.xy - uPointer.xy;
  float dist = length(d);
  float push = smoothstep(1.6, 0.0, dist) * (0.55 + aSeed.w * 0.5);
  p.xy += normalize(d + 0.0001) * push;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = mix(1.6, 5.5, pow(aSeed.w, 3.0)) + aRing * 1.2;
  gl_PointSize = size * uPixelRatio * (6.0 / -mv.z);
  vMix = aSeed.x;
  float twinkle = 0.55 + 0.45 * sin(t * (0.8 + aSeed.z * 2.0) + aSeed.y * 30.0);
  vAlpha = twinkle * (1.0 - uScroll * 0.9) * smoothstep(-14.0, -7.0, mv.z);
}
`

const fragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uDark;
varying float vMix;
varying float vAlpha;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  a = uDark > 0.5 ? pow(a, 1.6) : smoothstep(0.5, 0.25, d);
  vec3 col = vMix < 0.45 ? uA : vMix < 0.8 ? uB : uC;
  gl_FragColor = vec4(col, a * vAlpha * (uDark > 0.5 ? 0.9 : 0.55));
  #include <colorspace_fragment>
}
`

export function Particles({
  count = 2400,
  palette,
  pointerRef,
  scrollRef,
}: {
  count?: number
  palette: ScenePalette
  pointerRef: RefObject<{ x: number; y: number }>
  scrollRef: RefObject<number>
}) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const target = useMemo(() => new THREE.Vector3(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const { positions, seeds, ring } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count * 4)
    const ring = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const isRing = i < count * 0.28
      if (isRing) {
        const a = Math.random() * Math.PI * 2
        const r = 2.3 + Math.pow(Math.random(), 2) * 1.1
        positions.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.12, Math.sin(a) * r], i * 3)
      } else {
        positions.set([(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 12, -Math.random() * 8 + 1.5], i * 3)
      }
      seeds.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
      ring[i] = isRing ? 1 : 0
    }
    return { positions, seeds, ring }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector3(99, 99, 0) },
      uScroll: { value: 0 },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
      uC: { value: new THREE.Color() },
      uDark: { value: 1 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uA.value.copy(palette.a)
    uniforms.uB.value.copy(palette.b)
    uniforms.uC.value.copy(palette.c)
    uniforms.uDark.value = palette.dark ? 1 : 0
    const m = mat.current
    if (m) {
      m.blending = palette.dark ? THREE.AdditiveBlending : THREE.NormalBlending
      m.needsUpdate = true
    }
  }, [palette, uniforms])

  useFrame((state) => {
    const { camera, gl, clock } = state
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uPixelRatio.value = gl.getPixelRatio()
    uniforms.uScroll.value = scrollRef.current ?? 0
    const ptr = pointerRef.current
    if (ptr) {
      tmp.set(ptr.x, ptr.y, 0.5).unproject(camera).sub(camera.position).normalize()
      const dist = -camera.position.z / tmp.z
      target.copy(camera.position).addScaledVector(tmp, dist)
      uniforms.uPointer.value.lerp(target, 0.08)
    }
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 4]} />
        <bufferAttribute attach="attributes-aRing" args={[ring, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={palette.dark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  )
}
