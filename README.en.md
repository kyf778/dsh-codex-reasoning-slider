# DSH Codex reasoning slider

**English** | [简体中文](./README.md)

A Codex-style **reasoning-effort slider** that replaces the model picker in DeepSeek Harness.

> Split out of the original project as a standalone plugin that handles the slider only.
> Model ordering now lives in its own plugin,
> [dsh-model-order-settings](https://github.com/kyf778/dsh-model-order-settings).

## Features

- Replaces the plain model dropdown with a Codex-style slider (Off / Low / High / Ultra)
- Particle animation on the Ultra level
- A search box appears automatically when there are more than 4 models
- Reads the model order saved by [dsh-model-order-settings](https://github.com/kyf778/dsh-model-order-settings)

## Credits and attribution

**This plugin is a derivative work, based on [Nachoneko_miao's original](https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider) (MIT).**

Roughly three quarters of `client.js` is verbatim upstream code (the `Selector`
component, the pointer and canvas machinery, and the stylesheet all come from there).
As the MIT license requires:

- the original copyright notice is retained in `LICENSE`
- the original author is listed in `contributors` in `package.json`
- the changes made here are listed below

Changes made in this plugin relative to the original:

- split into a standalone plugin that handles the slider only (model ordering moved to its own plugin)
- added: reads and applies the user's saved model order
- removed: the reset-to-default button in the popup's top-right corner

> Original author: Nachoneko_miao. If you like it, please also star the
> [original repository](https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider).

## Standalone

This plugin **works on its own and does not depend on** the model-ordering plugin:

- Ordering plugin installed: models appear in the order you saved
- Not installed: models appear in the catalog's default order, and everything still works

The two plugins communicate through one `localStorage` key
(`dsh-codex-slider-model-order-v1`) and a `dsh-model-order-changed` window event,
so an order change shows up here immediately.

## Install

In Harness, open **Plugins → Add plugin** and paste this repository's URL. Or:

```bash
dsh plugin --profile desktop add github:kyf778/dsh-codex-reasoning-slider
```

Then click the model name below the composer input; if the slider expands, it worked.

## Compatibility

Tested only on DeepSeek Harness Desktop **0.2.0-rc.2** (Windows 11).

## License

MIT. See [LICENSE](./LICENSE) — it carries both the original (Nachoneko_miao) and this
plugin's (kyf778) copyright notices.
