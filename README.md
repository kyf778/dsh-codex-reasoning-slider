# dsh-codex-reasoning-slider

Codex-style reasoning-effort slider for the DeepSeek Harness model picker — a standalone plugin.

## What it does

Adds a Codex-style reasoning-effort slider to the model picker in the conversation composer:

- Switch model and pick a reasoning level (Off / Low / High / Ultra) in one popup
- Particle animation on the Ultra level
- Model search when more than four models are available
- Remembers the model order saved by the **dsh-model-order-settings** plugin

## Independent by design

This plugin is fully standalone. It works with the model-order plugin installed or not:

- With it: models appear in the order you saved there.
- Without it: models appear in their default order.

The two plugins share one `localStorage` key (`dsh-codex-slider-model-order-v1`) and a
`dsh-model-order-changed` window event, so an order change shows up here immediately.

## Install

```bash
dsh plugin --profile desktop add github:kyf778/dsh-codex-reasoning-slider
```

## License

MIT. Based on the original Codex-style slider by Nachoneko_miao (MIT).
