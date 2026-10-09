# DSH Codex reasoning slider

[English](./README.en.md) | **简体中文**

给 DeepSeek Harness 的模型选择器换成 Codex 桌面版风格的**推理强度滑块**。

> 这是从原版拆分出来的独立插件，只负责滑块本身。模型排序已拆成单独的插件
> [dsh-model-order-settings](https://github.com/kyf778/dsh-model-order-settings)。

## 功能

- 把原生模型下拉换成 Codex 风格滑条（Off / Low / High / Ultra 四档）
- Ultra 档位的粒子动效
- 模型超过 4 个时自动出现搜索框
- 会读取 [dsh-model-order-settings](https://github.com/kyf778/dsh-model-order-settings) 保存的模型顺序

## 来源与致谢

**本插件是衍生作品，基于 [Nachoneko_miao 的原版](https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider)（MIT）修改而来。**

约四分之三的 `client.js` 是原版的逐字代码（`Selector` 组件、指针与 canvas 逻辑、样式表都来自那边），所以按 MIT 许可证的要求：

- `LICENSE` 中保留了原版的版权声明
- `package.json` 的 `contributors` 列出了原作者
- 下方列明本插件相对原版做过的改动

本插件相对原版做过的改动：

- 拆成独立插件，只负责滑块本身（模型排序已分离为单独插件）
- 新增：读取并应用用户自定义的模型排序
- 移除：弹窗右上角的重置按钮

> 原版作者：Nachoneko_miao。如果喜欢，也请给[原仓库](https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider)点个 Star。

## 独立性

本插件**可单独使用，不依赖**模型排序插件：

- 装了排序插件：按你保存的顺序显示模型
- 没装：按模型目录的默认顺序显示，功能完全正常

两个插件通过同一个 `localStorage` 键（`dsh-codex-slider-model-order-v1`）和一个
`dsh-model-order-changed` 窗口事件通信，因此排序改动会立即反映到这里。

## 安装

在 Harness 里点 **插件 → 添加插件**，粘贴本仓库地址即可。或：

```bash
dsh plugin --profile desktop add github:kyf778/dsh-codex-reasoning-slider
```

装好后点会话输入栏下方的模型名称，展开看到滑条即为成功。

## 兼容性

只在 DeepSeek Harness Desktop **0.2.0-rc.2** 上测试过（Windows 11）。

## 许可证

MIT。见 [LICENSE](./LICENSE) —— 同时包含原版（Nachoneko_miao）与本插件（kyf778）的版权声明。
