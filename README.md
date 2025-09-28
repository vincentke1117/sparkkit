# SparkKit

SparkKit 是一个基于 Next.js 14 + Supabase 只读数据源构建的前端展示站点，聚焦于 CodePen 灵感作品的精选与多语言解读。站点通过 SSR + ISR 策略保障性能与 SEO，以移动端优先的玻璃拟态视觉呈现“封面 / 列表 / 详情 / 状态 / Sitemap”全链路体验。

## 功能概览

- **封面页**：深色霓虹视觉 + 今日精选 6 条 + GEO 时间徽章，可一键展开霓虹瀑布流浏览全部作品。
- **列表页 `/showcases`**：关键词 + 标签 + Stack + 难度筛选，分页呈现卡片，空态友好文案。
- **详情页 `/p/[user]/[slug]`**：标题 / 作者 / 原链 / 缩略图 / 多语言解读 / 复用步骤 / 性能提示 / 懒加载 oEmbed。缺少内容时提供 CodePen CTA。
- **状态页 `/status`**：展示版本号、最近同步时间、已索引数量与缓存命中率描述。
- **Sitemap**：`/sitemap.xml`（每日更新）。实现见 `app/sitemap.ts`，会读取最新作品并按北京时间 08:00 的日种子随机挑选 3 条 Advanced + 3 条 Intermediate 作为「今日精选」写入 XML。Next.js 会在路由层输出标准 sitemap 文档，无需额外静态文件。RSS 订阅尚未开放。
- **合规页**：隐私政策 `/privacy`、服务条款 `/terms` 与支持页 `/support`，方便提交 Google AdSense 审核。
- **多语言容错**：以 `NEXT_PUBLIC_DEFAULT_LOCALE` 作为 SSR 回退，客户端监听 `navigator.language` 自动切换；字段缺失时在中英间回退。
- **可访问性**：键盘焦点环、≥4.5:1 对比度、`alt` 占位与 `prefers-reduced-motion` 友好动效。
- **结构化数据**：全站注入 `WebSite + SearchAction` JSON-LD；详情页额外输出 `CreativeWork + BreadcrumbList`，并设置 canonical / hreflang / OG / Twitter 卡片。

## SEO 基线与域名配置

- **HTTPS 与首选域**：站点默认使用 `https://spark.vincentke.cc`，请在 DNS / Pages 自定义域中启用强制 HTTPS；若需 www 版本请在域名服务商层面做 301 重定向后再更新 `NEXT_PUBLIC_SITE_URL`。
- **Canonical**：所有页面会输出自引用 canonical 标签，并附 `zh-CN / en-US / x-default` hreflang，避免参数页重复收录。
- **Sitemap & Robots**：`/sitemap.xml` 每日自动刷新，`/robots.txt` 允许抓取静态资源，仅屏蔽 `/status`，并声明主机与站点地图地址。
- **重复内容处理**：针对 `?hl=` 等参数已通过 canonical 归并；若新增带参数的分享页面，请同样指向主要 URL。
- **结构化页面深度**：封面、列表、详情均可在三次点击内抵达，页眉和页脚保留“首页 / 全部作品 / 运行状态”等关键入口。

## 数据契约（与 Supabase 对齐）

前端严格按下列字段取数：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | UUID | 主键 |
| `pen_user` / `pen_slug` | string | 组合出原作品链接 `https://codepen.io/{pen_user}/pen/{pen_slug}` |
| `author_name` / `author_url` | string | 作者信息 |
| `thumbnail_url` | string | 缺失时提供渐变占位 |
| `oembed_html` | string | iframe 片段，详情页懒加载 |
| `stack` / `tags[]` / `difficulty` | string | 分类与标签，用于筛选 |
| `title_*` / `summary_*` / `headline_*` / `body_md_*` | string | 多语言标题 / 摘要 / 解读正文 |
| `key_points_*[]` / `reuse_steps_*[]` | string[] | 重点与复用步骤 |
| `perf_notes_*` | string | 性能提示 |
| `created_at` / `updated_at` | string | 发布时间与更新时间（可选） |

当 Supabase 凭据缺失或请求失败时，系统将自动回退至 `lib/mockData.ts` 中的示例数据，确保本地开发与演示稳定。

## 技术细节

- **框架**：Next.js 14 App Router，TypeScript，Tailwind CSS。
- **数据层**：`@supabase/supabase-js` 通过 ANON key 只读访问；`fetchShowcases` / `fetchShowcaseByUserAndSlug` / `fetchDistinctFilters` / `fetchSyncStatus` 提供统一数据入口。
- **缓存策略**：
  - 首页 `revalidate = 1800`（30 分钟）；
  - 列表页 `revalidate = 900`（15 分钟）；
  - 详情页 `revalidate = 600`（10 分钟）；
  - 状态页 `revalidate = 300`（5 分钟）；
  - Sitemap 每日刷新。
- **客户端容错**：`LanguageProvider` 监听 `navigator.language`，SSR 环境下安全回退；`OEmbedFrame` 采用 IntersectionObserver 懒加载嵌入内容；筛选组件对路由参数变更自适应。
- **UI 设计**：深色玻璃拟态、霓虹渐变、悬停微倾动效、A11y 焦点环、标签胶囊。

## 环境变量

在生产 / 预览环境中配置以下变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- （可选）`NEXT_PUBLIC_SUPABASE_TABLE`（默认 `frontend_showcase`）
- （可选）`NEXT_PUBLIC_SUPABASE_STATUS_VIEW`（默认 `showcase_sync_status`）
- （可选）`NEXT_PUBLIC_SITE_URL`（默认 `https://spark.vincentke.cc`，GitHub Pages / CDN 自定义域需填写完整 URL）
- （可选）`NEXT_PUBLIC_BASE_PATH`（如部署在子路径，例如 `/sparkkit`）
- （可选）`NEXT_PUBLIC_DEFAULT_LOCALE`（`zh` 或 `en`，控制 SSR 默认语言）

## 本地开发

```bash
npm install
npm run dev
```

运行后访问 `http://localhost:3000`，若未配置 Supabase 凭据则自动使用示例数据。

执行 `npm run build` 后可通过 `npm run start` 本地验证生产模式（SSR + ISR），确认页面在 Vercel 托管模式下正常运行。

### 使用示例 Supabase（可选）

如需连通真实数据，可在本地 `.env.local` 中写入以下只读凭据：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cvfsxwzgcadnfavthonp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_QyN33bNy2sozJxcM8SDciw_IPUW7MoA
```

默认会读取 `public.frontend_showcase` 表，若后续调整可通过 `NEXT_PUBLIC_SUPABASE_TABLE` 覆写。

## Vercel 部署指引

1. 在 Vercel 新建项目或导入本仓库，默认构建命令 `npm run build`、输出目录自动由框架处理（无需 `out/`）。
2. 在 **Project Settings → Environment Variables** 配置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - （推荐）`NEXT_PUBLIC_SITE_URL`：如 `https://sparkkit.vercel.app`
   - （可选）`NEXT_PUBLIC_DEFAULT_LOCALE`：`zh` 或 `en`
   - （可选）`NEXT_PUBLIC_SUPABASE_TABLE`、`NEXT_PUBLIC_SUPABASE_STATUS_VIEW`
3. 部署完成后启用 **Vercel Cron Jobs**（或外部触发器）在每日北京时间 08:00 调用再生成接口，例如 `POST /api/revalidate?secret=<SITE_REVALIDATE_TOKEN>`，以刷新首页、列表、详情与 sitemap。
4. 本地或 CI 中如需复现生产行为，可执行：

```bash
npm run build
npm run start
```

Vercel 原生支持 Next.js 的 SSR / ISR 与图片优化，因此不再需要 `output: export` 或手工上传 `out/` 目录。若后续仍需静态导出，可通过 `NEXT_PUBLIC_BASE_PATH` 等变量在运行时区分托管环境。

## 开源许可

本项目基于 [MIT License](./LICENSE) 开源，欢迎在遵守许可条款的前提下复制、修改与分发。若在生产环境中使用，建议保留版权声明并注明来源。
