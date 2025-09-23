# SparkKit

SparkKit 是一个基于 Next.js 14 + Supabase 只读数据源构建的前端展示站点，聚焦于 CodePen 灵感作品的精选与多语言解读。站点通过 SSR + ISR 策略保障性能与 SEO，以移动端优先的玻璃拟态视觉呈现“封面 / 列表 / 搜索 / 详情 / 状态 / RSS / Sitemap”全链路体验。

## 功能概览

- **封面页**：深色霓虹视觉 + 今日精选 6 条 + GEO 时间徽章，CTA 支持浏览与筛选。
- **列表页 `/showcases`**：关键词 + 标签 + Stack + 难度筛选，分页呈现卡片，空态友好文案。
- **搜索页 `/search`**：与列表页共用筛选组件，强调组合查询体验。
- **详情页 `/p/[user]/[slug]`**：标题 / 作者 / 原链 / 缩略图 / 多语言解读 / 复用步骤 / 性能提示 / 懒加载 oEmbed。缺少内容时提供 CodePen CTA。
- **状态页 `/status`**：展示版本号、最近同步时间、已索引数量与缓存命中率描述。
- **Sitemap & RSS**：`/sitemap.xml`（最近 5000 条，日更）与 `/rss.xml`（最近 100 条，6 小时刷新）。
- **多语言容错**：按 `navigator.language` 与 `Accept-Language` 自动挑选 `*_zh` 优先，其次 `*_en`，字段缺失时回退。
- **可访问性**：键盘焦点环、≥4.5:1 对比度、`alt` 占位与 `prefers-reduced-motion` 友好动效。
- **结构化数据**：全站注入 `WebSite + SearchAction` JSON-LD；详情页额外输出 `CreativeWork + BreadcrumbList`，并设置 canonical / hreflang / OG / Twitter 卡片。

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
  - 列表 / 搜索页 `revalidate = 900`（15 分钟）；
  - 详情页 `revalidate = 600`（10 分钟）；
  - 状态页 `revalidate = 300`（5 分钟）；
  - Sitemap 每日刷新，RSS 每 6 小时刷新。
- **客户端容错**：`LanguageProvider` 监听 `navigator.language`，SSR 环境下安全回退；`OEmbedFrame` 采用 IntersectionObserver 懒加载嵌入内容；筛选组件对路由参数变更自适应。
- **UI 设计**：深色玻璃拟态、霓虹渐变、悬停微倾动效、A11y 焦点环、标签胶囊。

## 环境变量

在生产 / 预览环境中配置以下变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- （可选）`NEXT_PUBLIC_SUPABASE_TABLE`（默认 `codepen_showcases`）
- （可选）`NEXT_PUBLIC_SUPABASE_STATUS_VIEW`（默认 `showcase_sync_status`）

## 本地开发

```bash
npm install
npm run dev
```

运行后访问 `http://localhost:3000`，若未配置 Supabase 凭据则自动使用示例数据。

## GitHub Actions 执行说明（无代码）

1. **触发方式**：
   - 每日固定 UTC 时刻的 `schedule`（建议偏移 5–10 分钟避开高峰）。
   - 支持 `workflow_dispatch` 手动触发用于紧急刷新。
   - 可选增加失败后的自动重试与通知。
2. **前置 Secrets / Vars**：
   - `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`（只读）。
   - `SITE_REVALIDATE_TOKEN`（若调用再生成接口）。
   - `SITEMAP_RSS_BUCKET`、`STATUS_PING_URL`、`PREVIEW_BASE_URL`（按需）。
3. **执行阶段建议拆分 Job**：
   1. 初始化：检出代码、设置 Node 版本、安装依赖（使用锁文件）。
   2. 环境校验：检测必需 Secrets 是否存在，缺失直接 fail。
   3. 数据拉取：调用 Supabase 读取最近 N 条/天记录，对比上次快照计算增量，输出新增/修改/下线统计。
   4. 再生成 / 缓存刷新：调用站点再验证接口或触发 CDN 失效，传入 `SITE_REVALIDATE_TOKEN`。
   5. 站点地图 & RSS：生成最新 `sitemap.xml`、`rss.xml`，必要时上传对象存储，校验 HTTP 200 与缓存头。
   6. 状态记录与通知：写入“最近同步时间”文件或表，并向 `STATUS_PING_URL` / ChatOps 发送摘要。
   7. 失败处理：捕获异常、归档日志，冷却 3–5 分钟后自动重试一次；连续失败≥2 次推送告警并暂停自动发布。
4. **安全与产出**：
   - 所有 Secrets 保持最小权限，禁止在日志打印完整密钥。
   - 日志需包含拉取数量、增量统计、再生成路径数、Sitemap / RSS 条目数及耗时。
   - 状态页应呈现最近一次 Actions 成功时间与数据增量概览。
