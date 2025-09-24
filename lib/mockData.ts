import { ShowcaseRecord, SyncStatus } from './types';

export const mockShowcases: ShowcaseRecord[] = [
  {
    id: 'mock-1',
    pen_user: 'madebyevan',
    pen_slug: 'threejs-demo',
    author_name: 'Evan You',
    author_url: 'https://codepen.io/madebyevan',
    thumbnail_url:
      'https://images.unsplash.com/photo-1527443224154-cb9e9e1d69c4?auto=format&fit=crop&w=960&q=80',
    oembed_html: null,
    stack: 'CSS',
    tags: ['animation', 'webgl', 'interactive'],
    difficulty: 'Advanced',
    title_zh: 'Three.js 玻璃态灯光秀',
    title_en: 'Three.js Glassmorphism Light Show',
    summary_zh: '以玻璃拟态与 WebGL 渲染打造的沉浸式灯光互动体验。',
    summary_en: 'Immersive glassmorphism stage rendered with WebGL and custom shaders.',
    headline_zh: '视觉与性能并重的舞台灯光',
    headline_en: 'Glassmorphism stage balancing aesthetics and performance',
    key_points_zh: [
      '自定义帧缓冲管理光晕与折射效果',
      'CSS 变量与 Three.js uniforms 双向绑定',
      'GPU Instancing 提升多光源渲染效率'
    ],
    key_points_en: [
      'Custom frame buffers drive glow and refraction',
      'CSS variables stay in sync with Three.js uniforms',
      'GPU instancing keeps dozens of lights smooth'
    ],
    body_md_zh:
      '通过 **Three.js** 构建的多光源舞台，结合玻璃拟态 UI。利用 `EffectComposer` 叠加发光后处理，并以 `requestAnimationFrame` 动态响应指针输入。',
    body_md_en:
      'A multi-light stage built with **Three.js** and glassmorphism UI. Uses `EffectComposer` glow passes and pointer-driven uniforms for responsive animation.',
    reuse_steps_zh: [
      '拆分光源与 UI 图层，便于复用',
      '以 CSS 变量控制全局主题色',
      '使用 Suspense 延迟加载 heavy shader 代码'
    ],
    reuse_steps_en: [
      'Split light sources and UI overlays for reuse',
      'Control palette through CSS custom properties',
      'Wrap heavy shader modules with Suspense'
    ],
    perf_notes_zh: '开启 `performance.now()` 监控，确保帧率维持在 50fps 以上。',
    perf_notes_en: 'Monitor `performance.now()` and keep frame times under 20ms.',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1800 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    pen_user: 'sdras',
    pen_slug: 'svg-lottie',
    author_name: 'Sarah Drasner',
    author_url: 'https://codepen.io/sdras',
    thumbnail_url:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80',
    oembed_html: null,
    stack: 'SVG',
    tags: ['svg', 'animation', 'lottie'],
    difficulty: 'Intermediate',
    title_zh: 'SVG x Lottie 动画实验',
    title_en: 'SVG x Lottie Animation Lab',
    summary_zh: '将 Lottie JSON 与 SVG 滤镜结合，实现极轻量动画表达。',
    summary_en: 'Lightweight animation using Lottie JSON coupled with SVG filters.',
    headline_zh: '跨平台动效的轻盈实现',
    headline_en: 'Delivering cross-platform motion with minimal payload',
    key_points_zh: [
      '通过 Lottie Web 动态挂载 JSON',
      'SVG filter 创建柔光与噪点质感',
      'IntersectionObserver 控制播放暂停'
    ],
    key_points_en: [
      'Loads JSON animation via Lottie Web',
      'SVG filters craft glow and texture',
      'IntersectionObserver toggles playback'
    ],
    body_md_zh:
      '结合 **Lottie** 与 SVG 滤镜的动效实验，适合登陆页或数据讲述。利用 `prefers-reduced-motion` 设置保障可及性。',
    body_md_en:
      'An experiment blending **Lottie** with SVG filters. Ideal for hero sections with respect for `prefers-reduced-motion`.',
    reuse_steps_zh: [
      '封装播放控制组件，响应滚动与焦点事件',
      '将滤镜定义放在 `<defs>` 中统一管理',
      '预设多套主题色供不同页面选择'
    ],
    reuse_steps_en: [
      'Wrap playback controls responding to scroll & focus',
      'Centralize filter definitions inside `<defs>`',
      'Prebuild palettes for theming different pages'
    ],
    perf_notes_zh: '动画资源 < 80KB，可内联于 HTML 增强首屏。',
    perf_notes_en: 'Animation payload is under 80KB; inline for faster first paint.',
    created_at: new Date(Date.now() - 86400 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7200 * 1000).toISOString(),
  },
];

export const mockStatus: SyncStatus = {
  version: '2025.09.23',
  lastSyncedAt: new Date().toISOString(),
  totalIndexed: mockShowcases.length,
  cacheHitRate: 0.86,
};
