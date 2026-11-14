"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   StoneField — pedras 3D em WebGL2 puro (sem biblioteca).
   • Rochas facetadas geradas por código (icosfera deformada, flat shading)
   • Giram sozinhas, inclinam com o mouse, mudam de profundidade (parallax) e
     reagem ao scroll. A luz principal segue o cursor → os reflexos "andam".
   • Sem WebGL2 → o CSS mostra os sprites antigos (fallback automático).
   • Pausa fora da tela, com a aba escondida e respeita prefers-reduced-motion.
   ────────────────────────────────────────────────────────────────────────── */

type Variant = "hero" | "services";
type ShapeName = "gem" | "slab" | "shard" | "flake" | "oval" | "rock";

interface Shape {
  sx: number;
  sy: number;
  sz: number;
  rough: number;
  taper?: number;
  level: number;
}

const SHAPES: Record<ShapeName, Shape> = {
  gem: { sx: 1, sy: 0.86, sz: 0.74, rough: 0.34, level: 1 },
  slab: { sx: 1.1, sy: 0.8, sz: 0.46, rough: 0.3, level: 1 },
  shard: { sx: 1.75, sy: 0.5, sz: 0.3, rough: 0.3, taper: 0.7, level: 1 },
  flake: { sx: 1.2, sy: 0.9, sz: 0.12, rough: 0.28, level: 1 },
  oval: { sx: 1.15, sy: 0.74, sz: 0.6, rough: 0.16, level: 2 },
  rock: { sx: 1, sy: 0.9, sz: 0.8, rough: 0.26, level: 2 },
};

interface Rock {
  shape: ShapeName;
  wide: [number, number];
  narrow: [number, number];
  size: number; // px em tela de 1440 (wide)
  sizeN: number; // px em tela de 400 (narrow)
  z: number;
  seed: number;
  spin: [number, number, number];
  gold?: boolean;
  soft?: boolean;
  delay: number;
}

const HERO: Rock[] = [
  { shape: "gem", wide: [0.5, 0.18], narrow: [0.07, 0.11], size: 132, sizeN: 64, z: 120, seed: 3, spin: [0.22, 0.3, 0.08], delay: 700 },
  { shape: "shard", wide: [0.93, 0.3], narrow: [0.93, 0.09], size: 156, sizeN: 78, z: 70, seed: 7, spin: [0.1, 0.34, 0.2], delay: 800 },
  { shape: "rock", wide: [0.66, 0.83], narrow: [0.93, 0.31], size: 138, sizeN: 66, z: 170, seed: 11, spin: [0.18, 0.26, 0.1], delay: 900 },
  { shape: "oval", wide: [0.455, 0.66], narrow: [0.5, 0.03], size: 84, sizeN: 44, z: -140, seed: 5, spin: [0.2, 0.15, 0.1], soft: true, delay: 1000 },
  { shape: "rock", wide: [0.89, 0.8], narrow: [0.07, 0.32], size: 118, sizeN: 60, z: 90, seed: 19, spin: [0.15, 0.3, 0.12], gold: true, delay: 1100 },
  { shape: "shard", wide: [0.37, 0.11], narrow: [0.86, 0.2], size: 108, sizeN: 52, z: -60, seed: 23, spin: [0.28, 0.22, 0.3], delay: 1200 },
  { shape: "oval", wide: [0.435, 0.86], narrow: [0.04, 0.21], size: 196, sizeN: 86, z: 290, seed: 29, spin: [0.1, 0.14, 0.06], soft: true, delay: 1300 },
  { shape: "flake", wide: [0.6, 0.07], narrow: [0.27, 0.045], size: 98, sizeN: 48, z: 40, seed: 31, spin: [0.3, 0.36, 0.2], gold: true, delay: 1400 },
  { shape: "gem", wide: [0.975, 0.58], narrow: [0.97, 0.2], size: 84, sizeN: 42, z: -110, seed: 37, spin: [0.2, 0.25, 0.15], delay: 1500 },
  { shape: "slab", wide: [0.745, 0.12], narrow: [0.66, 0.045], size: 100, sizeN: 48, z: 30, seed: 41, spin: [0.16, 0.2, 0.26], delay: 1600 },
];

const SERVICES: Rock[] = [
  { shape: "shard", wide: [0.04, 0.2], narrow: [0.06, 0.3], size: 128, sizeN: 70, z: 120, seed: 53, spin: [0.14, 0.3, 0.2], delay: 0 },
  { shape: "gem", wide: [0.965, 0.12], narrow: [0.92, 0.07], size: 140, sizeN: 74, z: 90, seed: 59, spin: [0.2, 0.26, 0.1], delay: 120 },
  { shape: "rock", wide: [0.03, 0.62], narrow: [0.95, 0.55], size: 104, sizeN: 62, z: 60, seed: 61, spin: [0.18, 0.24, 0.14], gold: true, delay: 240 },
  { shape: "slab", wide: [0.97, 0.74], narrow: [0.08, 0.86], size: 130, sizeN: 70, z: 150, seed: 67, spin: [0.12, 0.28, 0.16], delay: 360 },
  { shape: "oval", wide: [0.3, 0.975], narrow: [0.9, 0.965], size: 116, sizeN: 64, z: 220, seed: 71, spin: [0.1, 0.12, 0.08], soft: true, delay: 480 },
  { shape: "flake", wide: [0.885, 0.05], narrow: [0.5, 0.012], size: 88, sizeN: 54, z: 40, seed: 73, spin: [0.3, 0.34, 0.2], gold: true, delay: 600 },
];

/* ── geometria ─────────────────────────────────────────────────────────── */

type V3 = [number, number, number];

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const len = (v: V3) => Math.hypot(v[0], v[1], v[2]) || 1;
const norm = (v: V3): V3 => {
  const l = len(v);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const mid = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function icosphere(level: number): V3[][] {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = (
    [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ] as V3[]
  ).map(norm);
  const idx = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  let faces: V3[][] = idx.map((f) => f.map((i) => verts[i]));
  for (let l = 0; l < level; l++) {
    const next: V3[][] = [];
    for (const [a, b, c] of faces) {
      const ab = norm(mid(a, b));
      const bc = norm(mid(b, c));
      const ca = norm(mid(c, a));
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }
  return faces;
}

/** Retorna vértices intercalados: pos(3) normalPlana(3) normalSuave(3) faceRand(1). */
function buildRock(shape: Shape, seed: number): Float32Array {
  const rnd = mulberry32(seed);
  const cache = new Map<string, V3>();
  const displace = (v: V3): V3 => {
    const key = `${v[0].toFixed(4)},${v[1].toFixed(4)},${v[2].toFixed(4)}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const k = 1 + (rnd() - 0.5) * 2 * shape.rough;
    let y = v[1] * k * shape.sy;
    let z = v[2] * k * shape.sz;
    if (shape.taper) {
      const f = 1 - shape.taper * Math.min(1, Math.abs(v[0])) ** 1.6;
      y *= f;
      z *= f;
    }
    const out: V3 = [v[0] * k * shape.sx, y, z];
    cache.set(key, out);
    return out;
  };

  const faces = icosphere(shape.level);
  let maxR = 0;
  const tris = faces.map((f) => {
    const p = f.map(displace);
    p.forEach((q) => (maxR = Math.max(maxR, len(q))));
    return { p, orig: f };
  });

  const data: number[] = [];
  for (const { p, orig } of tris) {
    let [a, b, c] = p.map((q): V3 => [q[0] / maxR, q[1] / maxR, q[2] / maxR]);
    let o = orig;
    let n = norm(cross(sub(b, a), sub(c, a)));
    const centroid: V3 = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
    if (dot(n, centroid) < 0) {
      [b, c] = [c, b];
      o = [orig[0], orig[2], orig[1]];
      n = [-n[0], -n[1], -n[2]];
    }
    const face = rnd();
    const verts = [a, b, c];
    for (let i = 0; i < 3; i++) {
      const sm = norm([o[i][0] / shape.sx, o[i][1] / shape.sy, o[i][2] / shape.sz]);
      data.push(verts[i][0], verts[i][1], verts[i][2], n[0], n[1], n[2], sm[0], sm[1], sm[2], face);
    }
  }
  return new Float32Array(data);
}

/* ── matrizes ──────────────────────────────────────────────────────────── */

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

function viewProj(proj: Float32Array, camDist: number) {
  // proj * translate(0, 0, -camDist) (coluna-major)
  const out = new Float32Array(proj);
  for (let r = 0; r < 4; r++) out[12 + r] = proj[8 + r] * -camDist + proj[12 + r];
  return out;
}

function rotation(rx: number, ry: number, rz: number) {
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(rx), Math.sin(rx), Math.cos(ry), Math.sin(ry), Math.cos(rz), Math.sin(rz)];
  // R = Rx * Ry * Rz (linha-major)
  const ry_rz = [
    [cy * cz, -cy * sz, sy],
    [sz, cz, 0],
    [-sy * cz, sy * sz, cy],
  ];
  const R = [
    [ry_rz[0][0], ry_rz[0][1], ry_rz[0][2]],
    [cx * ry_rz[1][0] - sx * ry_rz[2][0], cx * ry_rz[1][1] - sx * ry_rz[2][1], cx * ry_rz[1][2] - sx * ry_rz[2][2]],
    [sx * ry_rz[1][0] + cx * ry_rz[2][0], sx * ry_rz[1][1] + cx * ry_rz[2][1], sx * ry_rz[1][2] + cx * ry_rz[2][2]],
  ];
  return R;
}

/* ── shaders ───────────────────────────────────────────────────────────── */

const VERT = `#version 300 es
in vec3 aPos; in vec3 aFlat; in vec3 aSmooth; in float aFace;
uniform mat4 uVP; uniform mat4 uModel; uniform mat3 uRot;
out vec3 vWorld; out vec3 vFlat; out vec3 vSmooth; flat out float vShade;
void main() {
  vec4 w = uModel * vec4(aPos, 1.0);
  vWorld = w.xyz;
  vFlat = uRot * aFlat;
  vSmooth = uRot * aSmooth;
  // cada faceta tem um tom próprio (como o brilho irregular das rochas da foto)
  vShade = 0.68 + 0.62 * fract(sin(aFace * 91.7) * 43758.5453);
  gl_Position = uVP * w;
}`;

const FRAG = `#version 300 es
precision highp float;
in vec3 vWorld; in vec3 vFlat; in vec3 vSmooth; flat in float vShade;
uniform vec3 uCam; uniform vec3 uLight; uniform vec3 uBase; uniform vec3 uSpec;
uniform float uSoft; uniform float uFade;
out vec4 outColor;
void main() {
  vec3 N = normalize(mix(vFlat, vSmooth, uSoft));
  vec3 V = normalize(uCam - vWorld);
  vec3 L = normalize(uLight);
  vec3 H = normalize(L + V);
  float ndl = max(dot(N, L), 0.0);
  float ndv = max(dot(N, V), 0.0);
  vec3 col = uBase * (0.14 + 1.0 * ndl) * vShade;
  float spec = pow(max(dot(N, H), 0.0), mix(70.0, 16.0, uSoft));
  col += uSpec * spec * mix(1.0, 0.3, uSoft);
  // luz de apoio, baixa e à esquerda
  vec3 L2 = normalize(vec3(-0.75, -0.45, 0.45));
  col += uSpec * 0.22 * pow(max(dot(N, normalize(L2 + V)), 0.0), 34.0);
  // o amarelo do fundo "batendo" nas bordas
  float rim = pow(1.0 - ndv, 2.6);
  col += vec3(0.95, 0.72, 0.08) * rim * 0.5;
  float alpha = mix(1.0, smoothstep(0.0, 0.6, ndv) * 0.85, uSoft) * uFade;
  outColor = vec4(col * alpha, alpha);
}`;

/* ── componente ────────────────────────────────────────────────────────── */

export default function StoneField({ variant = "hero" }: { variant?: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      depth: true,
      powerPreference: "low-power",
    });
    if (!gl) return; // sem WebGL2 → sprites CSS continuam visíveis

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rocks = variant === "hero" ? HERO : SERVICES;

    /* programa */
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const U = (name: string) => gl.getUniformLocation(program, name);
    const uni = {
      vp: U("uVP"), model: U("uModel"), rot: U("uRot"), cam: U("uCam"), light: U("uLight"),
      base: U("uBase"), spec: U("uSpec"), soft: U("uSoft"), fade: U("uFade"),
    };

    /* geometria de cada pedra (uma VAO por pedra) */
    const meshes = rocks.map((rock) => {
      const data = buildRock(SHAPES[rock.shape], rock.seed);
      const vao = gl.createVertexArray()!;
      gl.bindVertexArray(vao);
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const stride = 10 * 4;
      const attr = (name: string, size: number, offset: number) => {
        const loc = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset * 4);
      };
      attr("aPos", 3, 0);
      attr("aFlat", 3, 3);
      attr("aSmooth", 3, 6);
      attr("aFace", 1, 9);
      return { vao, count: data.length / 10 };
    });
    const order = rocks.map((_, i) => i).sort((a, b) => rocks[a].z - rocks[b].z);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    /* estado */
    let W = 1;
    let H = 1;
    let camDist = 1000;
    let vp = new Float32Array(16);
    const pointer = { tx: 0, ty: 0, x: 0, y: 0, active: false };
    let inView = true;
    let readyAt = 0;
    let seen = false;
    let frame = 0;
    let last = 0;
    const t0 = performance.now();
    const model = new Float32Array(16);
    const rot3 = new Float32Array(9);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, host.clientWidth < 760 ? 1.25 : 1.5);
      W = Math.max(1, host.clientWidth);
      H = Math.max(1, host.clientHeight);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const fov = (35 * Math.PI) / 180;
      camDist = H / 2 / Math.tan(fov / 2);
      vp = viewProj(perspective(fov, W / H, camDist * 0.2, camDist * 4), camDist);
      if (reduceMotion.matches) requestAnimationFrame(() => draw(performance.now()));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      pointer.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      pointer.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      pointer.active = true;
    };

    const isReady = () => (variant === "hero" ? document.body.classList.contains("page-ready") : seen);

    const draw = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const t = (now - t0) / 1000;
      const animate = !reduceMotion.matches;

      if (animate) {
        const a = 1 - Math.exp(-dt / 140);
        pointer.x += (pointer.tx - pointer.x) * a;
        pointer.y += (pointer.ty - pointer.y) * a;
        if (!pointer.active) {
          pointer.tx = 0;
          pointer.ty = 0;
        }
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!isReady()) return;
      if (!readyAt) readyAt = now;

      const rect = host.getBoundingClientRect();
      const scrollP = Math.max(-1, Math.min(1, -rect.top / H));
      const wide = W >= 960;
      const unit = wide ? Math.max(0.7, Math.min(1.5, W / 1440)) : Math.max(0.8, Math.min(1.9, W / 400));

      gl.uniformMatrix4fv(uni.vp, false, vp);
      gl.uniform3f(uni.cam, 0, 0, camDist);
      // a luz principal segue o cursor
      gl.uniform3f(uni.light, -0.45 + pointer.x * 0.95, 0.55 - pointer.y * 0.95, 0.8);

      for (const i of order) {
        const rock = rocks[i];
        const mesh = meshes[i];
        const e = animate ? Math.max(0, Math.min(1, (now - readyAt - rock.delay) / 1000)) : 1;
        if (e <= 0) continue;
        const back = 1 + 2.4 * Math.pow(e - 1, 3) + 1.4 * Math.pow(e - 1, 2); // easeOutBack
        const scaleIn = e >= 1 ? 1 : back;

        const [fx, fy] = wide ? rock.wide : rock.narrow;
        const size = (wide ? rock.size : rock.sizeN) * unit * scaleIn;
        const depth = 0.4 + (rock.z + 250) / 520; // mais perto → mexe mais
        const bob = animate ? Math.sin(t * 0.7 + i * 1.7) * 7 * unit : 0;
        const bobX = animate ? Math.cos(t * 0.5 + i * 2.3) * 5 * unit : 0;
        const px = animate ? pointer.x : 0;
        const py = animate ? pointer.y : 0;

        const x = fx * W - px * 46 * depth * unit + bobX;
        const y = fy * H - py * 34 * depth * unit + bob - scrollP * H * 0.1 * (rock.z / 300);

        const rx = i * 0.9 + rock.spin[0] * t * (animate ? 1 : 0) + py * 0.5 + scrollP * 0.9;
        const ry = i * 1.3 + rock.spin[1] * t * (animate ? 1 : 0) + px * 0.7 - scrollP * 0.6;
        const rz = i * 0.6 + rock.spin[2] * t * (animate ? 1 : 0);
        const R = rotation(rx, ry, rz);
        const s = size / 2;
        for (let c = 0; c < 3; c++) {
          for (let r = 0; r < 3; r++) {
            model[c * 4 + r] = R[r][c] * s;
            rot3[c * 3 + r] = R[r][c];
          }
          model[c * 4 + 3] = 0;
        }
        model[12] = x - W / 2;
        model[13] = H / 2 - y;
        model[14] = rock.z;
        model[15] = 1;

        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(uni.model, false, model);
        gl.uniformMatrix3fv(uni.rot, false, rot3);
        if (rock.gold) {
          gl.uniform3f(uni.base, 0.5, 0.36, 0.08);
          gl.uniform3f(uni.spec, 0.95, 0.78, 0.35);
        } else {
          gl.uniform3f(uni.base, 0.19, 0.19, 0.2);
          gl.uniform3f(uni.spec, 0.62, 0.62, 0.68);
        }
        gl.uniform1f(uni.soft, rock.soft ? 1 : 0);
        gl.uniform1f(uni.fade, Math.min(1, e * 2));
        gl.bindVertexArray(mesh.vao);
        gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
      }
    };

    const loop = (now: number) => {
      frame = 0;
      if (!inView || document.hidden) return;
      draw(now);
      if (!reduceMotion.matches) frame = requestAnimationFrame(loop);
      else if (!isReady()) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(loop);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        seen = true;
        start();
      }
    });
    observer.observe(host);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      delete host.dataset.stones;
      cancelAnimationFrame(frame);
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    const onLeave = () => {
      pointer.active = false;
    };
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);

    host.dataset.stones = "webgl";
    resize();
    start();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      delete host.dataset.stones;
      meshes.forEach((m) => gl.deleteVertexArray(m.vao));
      gl.deleteProgram(program);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`stone-canvas stone-canvas-${variant}`}
      aria-hidden="true"
    />
  );
}