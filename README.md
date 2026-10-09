# DSH Codex reasoning slider

Codex 风格的推理强度滑块，用于 DeepSeek Harness 的模型选择器。

A Codex-style reasoning-effort slider for the DeepSeek Harness model picker.

## 功能 / Features

- 把原生模型下拉换成 Codex 桌面版风格的滑条（Off / Low / High / Ultra）
- Ultra 档位的粒子动效
- 模型超过 4 个时提供搜索
- 会读取 **dsh-model-order-settings** 保存的模型顺序

## 来源与致谢 / Credits and attribution

**本插件是衍生作品，基于 [Nachoneko_miao 的原版](https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider)（MIT）修改而来。**

原版项目：`https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider`

本插件相对原版做过的改动：

- 拆成独立插件，只负责滑块本身（模型排序已分离为单独插件）
- 新增：读取并应用用户自定义的模型排序
- 移除：弹窗右上角的重置按钮

按 MIT 许可证要求，原版版权声明已保留在 `LICENSE` 中。

> 原版作者：Nachoneko_miao。如果喜欢，也请给原仓库点个 Star。

## 独立性 / Standalone

本插件可单独使用，不依赖模型排序插件：

- 装了排序插件：按你保存的顺序显示模型
- 没装：按模型目录的默认顺序显示

两个插件通过同一个 `localStorage` 键（`dsh-codex-slider-model-order-v1`）和一个
`dsh-model-order-changed` 窗口事件通信，因此排序改动会立即反映到这里。

## 安装 / Install

在 Harness 的 **插件 → 添加插件** 里粘贴本仓库地址，或：

```bash
dsh plugin --profile desktop add github:kyf778/dsh-codex-reasoning-slider
```

## 许可证 / License

MIT。见 [LICENSE](./LICENSE) —— 同时包含原版（Nachoneko_miao）与本插件（kyf778）的版权声明。
