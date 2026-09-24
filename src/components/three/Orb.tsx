import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface ScenePalette {
  a: THREE.Color
  b: THREE.Color
  c: THREE.Color
  dark: boolean
}

// Ashima Arts / Stefan Gustavson 3D simplex noise (MIT)
export const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const vertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
varying vec3 vObj;
${SIMPLEX_3D}

float field(vec3 p){
  float t = uTime * 0.22;
  float n = snoise(p * uFreq + vec3(t, t * 0.6, -t * 0.4));
  n += 0.35 * snoise(p * uFreq * 2.4 - vec3(t * 0.8));
  return n;
}

vec3 displaced(vec3 p){
  vec3 dir = normalize(p);
  return dir * (length(p) + field(p) * uAmp);
}

void main(){
  vec3 n = normalize(normal);
  vec3 tangent = normalize(abs(n.y) > 0.95 ? cross(n, vec3(1.0, 0.0, 0.0)) : cross(n, vec3(0.0, 1.0, 0.0)));
  vec3 bitangent = normalize(cross(n, tangent));
  float e = 0.012;
  vec3 p0 = displaced(position);
  vec3 p1 = displaced(position + tangent * e);
  vec3 p2 = displaced(position + bitangent * e);
  vec3 nn = normalize(cross(p1 - p0, p2 - p0));
  if (dot(nn, n) < 0.0) nn = -nn;

  vNoise = field(position);
  vObj = n;
  vec4 mv = modelViewMatrix * vec4(p0, 1.0);
  vView = -mv.xyz;
  vNormal = normalize(normalMatrix * nn);
  gl_Position = projectionMatrix * mv;
}
`

const fragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uDark;
uniform float uTime;
uniform float uFade;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
varying vec3 vObj;

vec3 tri(float t){
  t = fract(t) * 3.0;
  vec3 c = mix(uA, uB, smoothstep(0.0, 1.0, t));
  c = mix(c, uC, smoothstep(1.0, 2.0, t));
  c = mix(c, uA, smoothstep(2.0, 3.0, t));
  return c;
}

void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.4);

  float t = vNoise * 0.32 + fres * 0.55 + vObj.y * 0.18 + uTime * 0.03;
  vec3 iri = tri(t);
  vec3 iri2 = tri(t + 0.33);

  vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 L2 = normalize(vec3(0.7, -0.4, 0.5));
  float diff = max(dot(n, L), 0.0);
  float diff2 = max(dot(n, L2), 0.0);
  float spec = pow(max(dot(n, normalize(L + v)), 0.0), 64.0);
  float sheen = pow(max(dot(reflect(-v, n), L), 0.0), 6.0);

  vec3 col;
  if (uDark > 0.5) {
    vec3 core = iri * (0.04 + diff * 0.34) + iri2 * diff2 * 0.18;
    col = core + mix(iri, iri2, 0.5) * fres * 1.7 + vec3(spec) * 0.8 + iri2 * sheen * 0.2;
  } else {
    vec3 body = iri * (0.62 + diff * 0.5) + iri2 * diff2 * 0.3;
    col = mix(body, mix(iri2, vec3(1.0), 0.35), fres * 0.8) + vec3(spec) * 0.7 + sheen * 0.12;
  }
  gl_FragColor = vec4(col, uFade);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

export function Orb({
  palette,
  detail = 64,
  scrollRef,
  offsetY = 0,
}: {
  palette: ScenePalette
  detail?: number
  scrollRef: RefObject<number>
  offsetY?: number
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const intro = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.22 },
      uFreq: { value: 0.95 },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
      uC: { value: new THREE.Color() },
      uDark: { value: 1 },
      uFade: { value: 1 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uA.value.copy(palette.a)
    uniforms.uB.value.copy(palette.b)
    uniforms.uC.value.copy(palette.c)
    uniforms.uDark.value = palette.dark ? 1 : 0
  }, [palette, uniforms])

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    const p = scrollRef.current ?? 0
    intro.current = Math.min(1, intro.current + dt * 0.6)
    const k = 1 - Math.pow(1 - intro.current, 3)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uAmp.value = 0.09 + 0.07 * k + p * 0.12
    uniforms.uFade.value = 1 - Math.min(1, p * 1.1)
    m.rotation.y += dt * 0.08
    m.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    const s = (0.6 + 0.4 * k) * (1 - p * 0.25)
    m.scale.setScalar(s)
    m.position.z = THREE.MathUtils.lerp(m.position.z, -p * 3.5, 0.12)
    m.position.y = THREE.MathUtils.lerp(m.position.y, offsetY + p * 0.6, 0.12)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.12, detail]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} transparent />
    </mesh>
  )
}
