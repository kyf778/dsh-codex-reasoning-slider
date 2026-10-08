# dsh-codex-reasoning-slider

A **standalone** DeepSeek Harness (DSH) plugin that adds a Codex-style
reasoning-effort slider to the model picker.

This is one of two independent plugins split out from the original combined
`dsh-codex-reasoning-effort-slider`:

- **`dsh-codex-reasoning-slider`** (this repo) — the slider.
- [`dsh-model-order-settings`](https://github.com/kyf778/dsh-model-order-settings) — the model/provider ordering settings page.

They are fully decoupled: you can install **either one by itself** and it works,
or install **both** together — they never depend on each other. The only thing
they share is one localStorage key (`dsh-codex-model-order-v1`) so the slider
respects the order configured by the settings page when both are present. If
you only install this slider, models simply appear in the host's default order.

## Features

- Reasoning-effort slider (Off / Low / High / Ultra) on the model trigger button.
- Opens a popup with a searchable model list and the effort rail.
- A subtle particle burst when you reach **Ultra**.
- Follows the host light/dark theme via CSS variables.

## Install

In DeepSeek Harness, open **Settings → Plugins** and install from this GitHub
repo (`kyf778/dsh-codex-reasoning-slider`).

Or, for local development, link the folder into your DSH desktop profile:

```yaml
# ~/.dsh/profiles/desktop/package.json  (dependencies)
"@local/dsh-codex-reasoning-slider": "link:/path/to/this/folder"
```

and add `@local/dsh-codex-reasoning-slider` to `dsh.profile.bundles`.

## Compatibility

- DeepSeek Harness `>= 0.2.0-rc.2`.
- Injects `conversation.input.model`.

## License

MIT
