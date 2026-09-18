# 留学选题雷达

面向「广州新东方留学」官方公众号的热点监测、选题评分与日报工作台。

## 第一版能力

- 汇总 DailyHotApi 公共热榜候选话题
- 为留学选题提供热度、官号适配、家长关注、时效性、本地关联五维评分
- 标注已核实与待复核信源，避免直接把热搜当事实发布
- 自动生成公众号标题与切入角度
- 每天北京时间 08:30 由 GitHub Actions 更新数据
- 一键下载 Markdown 选题日报
- 响应式网页后台，可通过 GitHub Pages 部署

## 已接入 Skill

- `edu-digest`：留学行业周报，区分本周新增、申请提醒和待核实线索。
- `study-abroad-content-topics`：严格生成5个时事选题＋5个常青选题。
- `wechat-article-studio`：按广州新东方留学品牌档案生成公众号写作方案、5组标题摘要、单一CTA和编辑备注。

公开网页不会保存模型或公众号密钥；目前文章工作台提供安全的规则草稿，正式文章仍需编辑审核与事实补充。

## 数据架构

1. **TrendRadar / DailyHotApi**：发现热点。
2. **RSSHub / 院校及政府官网**：核实政策与申请信息。
3. **wechat-data-tools**：作为后续竞品数据适配层；凭证只通过 Secrets 配置。
4. **AI 选题引擎**：当前提供可解释的五维规则评分，后续可通过私密 API Key 接入大模型复核和标题生成。

## 本地运行

```bash
npm run generate
npm run serve
```

访问 `http://localhost:4173`。

## GitHub Pages

进入仓库 **Settings → Pages → Build and deployment**，将 Source 设为 **GitHub Actions**。推送到 `main` 后会自动部署。

## 内容安全

- 热榜只能用于发现候选话题，所有政策、院校要求、费用和截止日期必须回到官方原文核实。
- `verified: false` 的内容会在后台明确显示“需要复核”。
- 不要把公众号 AppSecret、第三方数据服务 Token 或 AI API Key 提交到公开仓库；请使用 GitHub Actions Secrets。
