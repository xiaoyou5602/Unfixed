'use strict';
// 底页的着色器：网点、碎片、印刷层都在这里叠印。paper.js 编译它

const VS = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uBreath;
uniform float uCell; uniform float uAmp; uniform vec3 uPaper; uniform vec4 uCalm;
uniform sampler2D uAtlas; uniform sampler2D uPrintA; uniform sampler2D uPrintB; uniform float uPrintMix;
uniform int uN; uniform vec4 uFR[10]; uniform vec4 uFC[10]; uniform vec4 uFP[10];
uniform vec4 uWave; uniform vec4 uWaveXf; uniform float uWaveAmt;
out vec4 o;

const vec3 CYAN = vec3(0.10, 0.50, 0.71);
const vec3 NAVY = vec3(0.12, 0.15, 0.27);
const vec3 BLUE = vec3(0.12, 0.21, 0.88);
const vec3 RED  = vec3(0.89, 0.24, 0.18);

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
vec2 rot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }

// 位移场：几组方向不同、速度不同的正弦波，再做一次域扭曲，缓慢且不重复
vec2 field(vec2 p, float t){
  float qx = p.x * 0.0034, qy = p.y * 0.0034;
  float wx = sin(qy * 1.7 + t * 0.11) + 0.6 * sin(qx * 1.13 - qy * 0.71 + t * 0.07);
  float wy = sin(qx * 1.3 - t * 0.09) + 0.6 * sin(qy * 1.27 + qx * 0.53 + t * 0.13);
  qx += wx * 0.55; qy += wy * 0.55;
  float dx = sin(qy * 2.3 + t * 0.21);
  float dy = 0.9 * sin(qx * 1.9 - t * 0.17);
  dx += 0.7 * sin(qx * 1.37 + qy * 2.11 + t * 0.13 + 1.3);
  dy += 0.7 * cos(-qx * 2.41 + qy * 0.83 - t * 0.19 + 0.4);
  dx += 0.35 * cos(qx * 3.7 - qy * 1.3 + t * 0.29);
  dy += 0.35 * sin(qx * 0.9 + qy * 3.9 + t * 0.23 + 2.0);
  return vec2(dx, dy);
}

// 青色网点的浓淡：斜向的波带，上下边缘淡出
float toneField(vec2 w, float t){
  vec2 u = w / uRes;
  float a = sin(w.x * 0.0042 + sin(w.y * 0.0031 - t * 0.05) * 1.6 + t * 0.04);
  float b = sin(w.y * 0.0057 - w.x * 0.0016 + t * 0.06 + 1.7);
  float v = 0.42 + 0.22 * a + 0.16 * b + 0.2 * (vnoise(w * 0.0025 + t * 0.02) - 0.5);
  if (uWaveAmt > 0.) {
    // 波浪建筑那张图当底纹：铺满屏幕、镜像衔接、慢慢漂
    vec2 L = w * uWaveXf.xy + uWaveXf.zw + vec2(sin(t * 0.031), cos(t * 0.023)) * 0.04;
    L = 1.0 - abs(mod(L, 2.0) - 1.0);
    vec2 wuv = mix(uWave.xy, uWave.zw, L);
    float wv = textureLod(uAtlas, vec2(wuv.x, wuv.y * 0.5), 0.).r;
    v = mix(v, 0.1 + 0.62 * wv, uWaveAmt);
  }
  float ey = smoothstep(0.0, 0.32, u.y) * (1.0 - smoothstep(0.62, 1.04, u.y));
  float ex = smoothstep(-0.05, 0.18, u.x) * (1.0 - smoothstep(0.85, 1.05, u.x));
  v *= mix(0.22, 1.0, ey) * mix(0.55, 1.0, ex);
  v *= 1.0 + 0.07 * uBreath;
  return clamp(v, 0., 1.);
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  float t = uTime;
  vec2 C = uRes * 0.5;
  vec2 disp = field(p, t) * uAmp;
  disp += (vec2(vnoise(p * 0.006 + t * 0.03), vnoise(p * 0.006 + 11.7 - t * 0.025)) - 0.5) * uAmp * 0.8;

  // 纸
  vec3 col = uPaper;
  float fib = vnoise(p * vec2(0.035, 0.22)) * 0.6 + vnoise(p * vec2(0.11, 0.6)) * 0.4;
  col *= 1.0 - 0.03 * fib;
  col *= 1.0 - 0.025 * (vnoise(p * 0.004 + t * 0.01) - 0.5);

  // 纸条底下让网点安静一些
  float calm = 0., under = 0.;
  if (uCalm.z > 0.) {
    vec2 dq = abs(p - (uCalm.xy + uCalm.zw * 0.5)) - uCalm.zw * 0.5;
    float sd = length(max(dq, 0.)) + min(max(dq.x, dq.y), 0.);
    calm = 1.0 - smoothstep(-10., 70., sd);
    under = 1.0 - smoothstep(-4., 4., sd);
  }

  // 碎片：在更深一层（位移只取 0.55），用 45° 网屏印成深蓝或红
  vec2 q = p + disp * 0.55;
  float cell2 = uCell * 0.62 * (1.0 + 0.012 * uBreath);
  vec2 g2 = rot(q - C, -0.785398) / cell2;
  vec2 id2 = floor(g2 + 0.5);
  float d2 = length(g2 - id2);
  float aa2 = min(fwidth(d2) * 0.7, 0.2);
  vec2 cq = C + rot(id2 * cell2, 0.785398);
  // 专色（红或蓝）用 75° 网屏，和深蓝版错开角度
  vec2 g3 = rot(q - C, -1.308997) / cell2;
  vec2 id3 = floor(g3 + 0.5);
  float d3 = length(g3 - id3);
  float aa3 = min(fwidth(d3) * 0.7, 0.2);
  vec2 cq3 = C + rot(id3 * cell2, 1.308997);
  float navy = 0., red = 0., blue = 0., fpaper = 0.;
  for (int i = 0; i < 10; i++) {
    if (i >= uN) break;
    vec4 R = uFR[i]; vec4 P = uFP[i];
    vec2 uv = (q - R.xy) / R.zw;
    if (uv.x < -0.02 || uv.y < -0.02 || uv.x > 1.02 || uv.y > 1.02) continue;
    float life = P.x;
    float env = smoothstep(0.0, 0.28, life) * (1.0 - smoothstep(0.80, 1.0, life));
    float dev = smoothstep(0.08, 0.46, life) * (1.0 - smoothstep(0.72, 0.93, life));
    // 像素化遮罩：6px 的块，从中心带着噪声向外长出来，边缘留一圈参差的台阶
    vec2 bq = floor(q / 6.0);
    vec2 bp = (bq + 0.5) * 6.0;
    float edPx = min(min(bp.x - R.x, R.x + R.z - bp.x), min(bp.y - R.y, R.y + R.w - bp.y));
    float n = hash(bq + P.y * 31.7) * 0.45 + vnoise(bq * 0.18 + P.y * 7.0) * 0.55;
    float score = clamp(edPx / 50.0, 0., 1.) * 0.55 + n * 0.45;
    float th = 1.12 - env;
    float m = smoothstep(th - 0.04, th + 0.04, score) * step(0., edPx);
    if (m <= 0.) continue;
    // 显影：先出最暗处，再慢慢出中间调
    float gam = mix(3.2, 1.0, dev);
    vec2 kuv = mix(uFC[i].xy, uFC[i].zw, clamp((cq - R.xy) / R.zw, 0., 1.));
    float dark = pow(clamp(textureLod(uAtlas, vec2(kuv.x, kuv.y * 0.5), 0.).r, 0., 1.), gam) * dev;
    float r = sqrt(dark) * 0.58 + (vnoise(p * 0.7) - 0.5) * 0.05;
    float ink = (1.0 - smoothstep(r - aa2, r + aa2, d2)) * step(0.02, dark);
    navy = max(navy, ink * m * (0.9 + 0.1 * vnoise(p * 0.03 + P.y)));
    if (P.w > 0.5) {
      vec2 suv = mix(uFC[i].xy, uFC[i].zw, clamp((cq3 - R.xy) / R.zw, 0., 1.));
      float sp = pow(clamp(textureLod(uAtlas, vec2(suv.x, 0.5 + suv.y * 0.5), 0.).r, 0., 1.), gam) * dev;
      float rs = sqrt(sp) * 0.58 + (vnoise(p * 0.7 + 5.0) - 0.5) * 0.05;
      float sink = (1.0 - smoothstep(rs - aa3, rs + aa3, d3)) * step(0.02, sp) * m;
      if (P.w < 1.5) red = max(red, sink); else blue = max(blue, sink);
    }
    fpaper = max(fpaper, m * env);
  }

  // 青色网点：15° 网屏，整片跟着位移场走
  vec2 pw = p + disp;
  float cell = uCell * (1.0 + 0.015 * uBreath);
  vec2 g1 = rot(pw - C, -0.261799) / cell;
  vec2 id1 = floor(g1 + 0.5);
  float d1 = length(g1 - id1);
  float aa1 = min(fwidth(d1) * 0.7, 0.2);
  vec2 cw = C + rot(id1 * cell, 0.261799);
  float tone = toneField(cw, t) * (1.0 - 0.8 * calm) * (1.0 - 0.6 * fpaper);
  float r1 = 0.37 * sqrt(tone) + (vnoise(p * 0.8) - 0.5) * 0.04;
  float cy = (1.0 - smoothstep(r1 - aa1, r1 + aa1, d1)) * step(0.015, tone);
  cy *= mix(0.5, 1.0, tone) * (0.9 + 0.1 * vnoise(p * 0.012));

  // 印刷层：大标题和角标，轻微跟着漂，边缘做成孔版那种毛糙
  vec2 puv = (p + disp * 0.22) / uRes;
  float sel = step(hash(floor(p / 8.0) * 1.37 + 4.1), uPrintMix);
  vec3 pr = mix(texture(uPrintA, puv).rgb, texture(uPrintB, puv).rgb, sel);
  float rough = (vnoise(p * 0.55) - 0.5) * 0.3 + (hash(floor(p * 1.3)) - 0.5) * 0.12;
  vec3 cov = clamp((pr - 0.5) * 1.8 + 0.5 + rough, 0., 1.);
  cov *= 1.0 - 0.35 * step(0.94, hash(floor(p * 0.9) + 7.0));
  cov *= 0.88 + 0.12 * vnoise(p * 0.015);
  cov *= 1.0 - 0.8 * under;

  // 叠印（正片叠底）
  col *= mix(vec3(1.), vec3(0.985, 0.975, 0.955), fpaper);
  col *= mix(vec3(1.), CYAN, cy * 0.92);
  col *= mix(vec3(1.), BLUE, cov.r * 0.94);
  col *= mix(vec3(1.), RED, cov.g * 0.9);
  col *= mix(vec3(1.), NAVY, cov.b * 0.9);
  col *= mix(vec3(1.), NAVY, navy * 0.95);
  col *= mix(vec3(1.), RED, red * 0.9);
  col *= mix(vec3(1.), BLUE, blue * 0.88);
  col += (hash(gl_FragCoord.xy * 0.5 + 3.3) - 0.5) * 0.025;
  o = vec4(col, 1.);
}`;
