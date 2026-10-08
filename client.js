window.__ModuleLoader__.load({
  id: '@local/dsh-codex-reasoning-slider',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useLayoutEffect, useRef, useSyncExternalStore } = React;
    const NS = 'dsh-codex-reasoning-slider';
    const zh = {
      choose: '选择模型', effort: '思考等级',
      reset: '重置为默认', warning: '更快消耗使用额度', model: '切换模型', back: '返回',
      loading: '正在加载模型', empty: '没有可用模型', unsupported: '此模型未提供思考等级',
      retry: '重试', busy: '正在切换', failed: '切换失败', unavailable: '此会话不能切换模型',
      search: '搜索模型', noMatch: '没有匹配的模型'
    };
    const en = {
      choose: 'Select model', effort: 'Reasoning effort',
      reset: 'Reset to default', warning: 'Consumes usage quota faster', model: 'Switch model', back: 'Back',
      loading: 'Loading models', empty: 'No available models', unsupported: 'No reasoning levels for this model',
      retry: 'Retry', busy: 'Switching', failed: 'Selection failed', unavailable: 'Model selection unavailable',
      search: 'Search models', noMatch: 'No matching models'
    };
    const labels = { off: 'Off', low: 'Low', high: 'High', max: 'Ultra' };
    const order = ['off', 'low', 'high', 'max'];
    // ---- shared user-defined model ordering (read-only here) ----
    // The order is edited by the separate "dsh-model-order-settings" plugin, but
    // both plugins agree on this localStorage key so they stay in sync. If only
    // this slider is installed, the order simply stays at its defaults.
    const ORDER_KEY = 'dsh-codex-model-order-v1';
    const ORDER_KEY_LEGACY = 'dsh-codex-slider-model-order-v1';
    function readOrder() {
      try {
        let raw = localStorage.getItem(ORDER_KEY);
        if (!raw) raw = localStorage.getItem(ORDER_KEY_LEGACY);
        if (!raw) return { providers: [], models: {} };
        const parsed = JSON.parse(raw);
        // Migrate from the legacy key once so both plugins share one source.
        if (!localStorage.getItem(ORDER_KEY)) {
          try { localStorage.setItem(ORDER_KEY, raw); } catch {}
        }
        return {
          providers: Array.isArray(parsed?.providers) ? parsed.providers.filter(x => typeof x === 'string') : [],
          models: parsed && typeof parsed.models === 'object' && parsed.models !== null ? parsed.models : {}
        };
      } catch { return { providers: [], models: {} }; }
    }
    let orderSnapshot = readOrder();
    const orderListeners = new Set();
    function subscribeOrder(listener) {
      orderListeners.add(listener);
      // The order is edited by the separate "dsh-model-order-settings" plugin;
      // it emits this event (plus the storage event for other windows) so the
      // slider updates live within the same window.
      const onChanged = () => { orderSnapshot = readOrder(); try { listener(); } catch {} };
      window.addEventListener('dsh-model-order-changed', onChanged);
      return () => { orderListeners.delete(listener); window.removeEventListener('dsh-model-order-changed', onChanged); };
    }
    window.addEventListener('storage', (e) => {
      if (e.key === ORDER_KEY || e.key === ORDER_KEY_LEGACY) {
        orderSnapshot = readOrder();
        orderListeners.forEach(listener => { try { listener(); } catch {} });
      }
    });
    /** Rank of an id in a saved order list; unknown ids sort last, stably. */
    function rankOf(list, id) {
      const index = list.indexOf(id);
      return index < 0 ? Number.MAX_SAFE_INTEGER : index;
    }
    /** Apply the saved provider/model order; unknown entries keep their relative order. */
    function applyOrder(groups, saved) {
      const providers = saved?.providers ?? [];
      const models = saved?.models ?? {};
      const sorted = groups.map(group => {
        const wanted = models[group.id] ?? [];
        return { ...group, models: [...group.models].sort((a, b) => rankOf(wanted, a.id) - rankOf(wanted, b.id)) };
      });
      return sorted.sort((a, b) => rankOf(providers, a.id) - rankOf(providers, b.id));
    }
    function icon(name, outline) {
      switch (name) {
        case 'back': return h('svg', { className: 'dsh-codex-reasoning-slider-ico', viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M15 18l-6-6 6-6' }));
        case 'search': return h('svg', { className: 'dsh-codex-reasoning-slider-ico', viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('circle', { cx: 11, cy: 11, r: 7 }), h('path', { d: 'M21 21l-4.3-4.3' }));
        case 'check': return h('svg', { className: 'dsh-codex-reasoning-slider-ico', viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M5 13l4 4L19 7' }));
        case 'reset': return h('svg', { className: 'dsh-codex-reasoning-slider-ico', viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M3 12a9 9 0 1 0 3-6.7L3 8' }), h('path', { d: 'M3 3v5h5' }));
        case 'down': return h('svg', { className: 'dsh-codex-reasoning-slider-ico', viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M6 9l6 6 6-6' }));
        case 'chevron': return h('svg', { className: 'dsh-codex-reasoning-slider-ico', viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M9 6l6 6-6 6' }));
        case 'model': return h('svg', { className: 'dsh-codex-reasoning-slider-ico', viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('rect', { x: 3, y: 4, width: 18, height: 16, rx: 3 }), h('path', { d: 'M3 9h18M8 14h8' }));
        default: return null;
      }
    }
    // Base theme tokens; the slider reads CSS variables exposed by the host so it
    // follows light/dark automatically.
    const styles = `
.dsh-codex-reasoning-slider-root{position:relative;display:inline-flex;align-items:center;}
.dsh-codex-reasoning-slider-trigger{position:relative;display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 12px;border:1px solid var(--dsh-border,#d7dbe3);border-radius:10px;background:var(--dsh-control,#fff);color:var(--dsh-text,#1c2330);font:600 13px/1 system-ui,sans-serif;cursor:pointer;transition:border-color .15s,box-shadow .15s,background .15s;}
.dsh-codex-reasoning-slider-trigger:hover{border-color:var(--dsh-accent,#3988f6);}
.dsh-codex-reasoning-slider-trigger:disabled{opacity:.5;cursor:not-allowed;}
.dsh-codex-reasoning-slider-trigger.ultra{border-color:#a56be9;color:#7b3fd1;background:linear-gradient(180deg,#f6eefe,#fff);}
.dsh-codex-reasoning-slider-trigger-bolt{width:16px;height:16px;fill:var(--dsh-accent,#3988f6);}
.dsh-codex-reasoning-slider-trigger.ultra .dsh-codex-reasoning-slider-trigger-bolt{fill:#a56be9;}
.dsh-codex-reasoning-slider-compact{display:none;}
.dsh-codex-reasoning-slider-caption{white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;}
.dsh-codex-reasoning-slider-trigger-effort{color:var(--dsh-accent,#3988f6);}
.dsh-codex-reasoning-slider-trigger.ultra .dsh-codex-reasoning-slider-trigger-effort{color:#7b3fd1;}
.dsh-codex-reasoning-slider-popup{position:absolute;top:calc(100% + 8px);left:0;z-index:1000;min-width:300px;background:var(--dsh-popover,#fff);color:var(--dsh-text,#1c2330);border:1px solid var(--dsh-border,#d7dbe3);border-radius:14px;box-shadow:0 18px 48px rgba(20,30,60,.18);padding:14px;opacity:0;transform:translateY(-6px) scale(.98);pointer-events:none;transition:opacity .16s,transform .16s;overflow:hidden;}
.dsh-codex-reasoning-slider-popup:not(.closed){opacity:1;transform:none;pointer-events:auto;}
.dsh-codex-reasoning-slider-popup.closed{display:none;}
.dsh-codex-reasoning-slider-pane{transition:opacity .12s;}
.dsh-codex-reasoning-slider-pane.hidden{display:none;}
.dsh-codex-reasoning-slider-searchRow{display:flex;align-items:center;gap:6px;margin-bottom:10px;}
.dsh-codex-reasoning-slider-search{display:flex;align-items:center;gap:6px;flex:1;padding:6px 8px;border:1px solid var(--dsh-border,#d7dbe3);border-radius:8px;background:var(--dsh-control,#fff);}
.dsh-codex-reasoning-slider-searchInput{border:0;outline:0;background:transparent;color:inherit;font:500 13px system-ui,sans-serif;width:100%;}
.dsh-codex-reasoning-slider-searchClear{border:0;background:transparent;color:var(--dsh-muted,#8a93a6);cursor:pointer;font-size:16px;line-height:1;}
.dsh-codex-reasoning-slider-searchBack{border:0;background:transparent;color:var(--dsh-muted,#8a93a6);cursor:pointer;display:inline-flex;padding:2px;}
.dsh-codex-reasoning-slider-modelsList{max-height:300px;overflow:auto;display:flex;flex-direction:column;gap:2px;}
.dsh-codex-reasoning-slider-group{font:600 11px system-ui,sans-serif;color:var(--dsh-muted,#8a93a6);text-transform:uppercase;letter-spacing:.04em;margin:8px 2px 4px;}
.dsh-codex-reasoning-slider-option{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 10px;border:0;border-radius:8px;background:transparent;color:inherit;font:500 13px system-ui,sans-serif;text-align:left;cursor:pointer;}
.dsh-codex-reasoning-slider-option:hover{background:var(--dsh-hover,#eef2f8);}
.dsh-codex-reasoning-slider-option[aria-checked="true"]{background:var(--dsh-accent-soft,#e8f1ff);color:var(--dsh-accent,#3988f6);}
.dsh-codex-reasoning-slider-option:disabled{opacity:.45;cursor:not-allowed;}
.dsh-codex-reasoning-slider-option-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.dsh-codex-reasoning-slider-ico{width:15px;height:15px;flex:0 0 auto;}
.dsh-codex-reasoning-slider-heading{display:flex;align-items:center;gap:6px;font:600 13px system-ui,sans-serif;cursor:pointer;color:var(--dsh-text,#1c2330);}
.dsh-codex-reasoning-slider-model{margin-left:auto;color:var(--dsh-muted,#8a93a6);font-weight:500;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.dsh-codex-reasoning-slider-model-link{display:flex;align-items:center;gap:6px;background:transparent;border:0;color:inherit;cursor:pointer;width:100%;margin-bottom:8px;}
.dsh-codex-reasoning-slider-warning{font:500 11px system-ui,sans-serif;color:#c2703a;margin:2px 0 10px;}
.dsh-codex-reasoning-slider-rail{position:relative;height:52px;border-radius:12px;background:linear-gradient(180deg,var(--dsh-hover,#eef2f8),var(--dsh-control,#f6f8fc));border:1px solid var(--dsh-border,#d7dbe3);cursor:pointer;touch-action:none;user-select:none;}
.dsh-codex-reasoning-slider-rail.dragging{box-shadow:0 0 0 3px var(--dsh-accent-soft,#e8f1ff);}
.dsh-codex-reasoning-slider-fill{position:absolute;left:15px;right:15px;top:50%;height:6px;transform:translateY(-50%);border-radius:6px;background:var(--dsh-border,#d7dbe3);}
.dsh-codex-reasoning-slider-fill::before{content:"";position:absolute;left:0;top:0;bottom:0;width:calc((100% ) * var(--dsh-codex-reasoning-effort-slider-pos,0));border-radius:6px;background:linear-gradient(90deg,#3988f6,#a56be9);}
.dsh-codex-reasoning-slider-dot{position:absolute;top:50%;width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid var(--dsh-border,#d7dbe3);transform:translate(calc(-50% + 15px + var(--dsh-codex-reasoning-effort-slider-tick,0) * (100% ) ),-50%);transition:left .1s;left:0;}
.dsh-codex-reasoning-slider-dot.passed{border-color:var(--dsh-accent,#3988f6);background:var(--dsh-accent,#3988f6);}
.dsh-codex-reasoning-slider-dot.hovered{transform:translate(calc(-50% + 15px + var(--dsh-codex-reasoning-effort-slider-tick,0) * (100% ) ),-50%) scale(1.25);}
.dsh-codex-reasoning-slider-knob{position:absolute;top:50%;left:calc(15px + var(--dsh-codex-reasoning-effort-slider-pos,0) * (100%  - 30px));transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid var(--dsh-accent,#3988f6);box-shadow:0 4px 12px rgba(57,136,246,.35);transition:left .08s;}
.dsh-codex-reasoning-slider-rail.dragging .dsh-codex-reasoning-slider-knob{transition:none;}
.dsh-codex-reasoning-slider-popup.ultra .dsh-codex-reasoning-slider-knob{border-color:#a56be9;box-shadow:0 4px 14px rgba(165,107,233,.45);}
.dsh-codex-reasoning-slider-sparks,.dsh-codex-reasoning-slider-burst{position:absolute;inset:0;pointer-events:none;}
.dsh-codex-reasoning-slider-railSingle .dsh-codex-reasoning-slider-knob{left:calc(15px + var(--dsh-codex-reasoning-effort-slider-pos,0) * (100%  - 30px));}
.dsh-codex-reasoning-slider-noeffort{font:500 12px system-ui,sans-serif;color:var(--dsh-muted,#8a93a6);padding:6px 2px;}
.dsh-codex-reasoning-slider-tool{position:absolute;top:10px;right:10px;width:30px;height:30px;border:1px solid var(--dsh-border,#d7dbe3);border-radius:8px;background:var(--dsh-control,#fff);color:var(--dsh-muted,#8a93a6);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;}
.dsh-codex-reasoning-slider-tool:hover{color:var(--dsh-accent,#3988f6);border-color:var(--dsh-accent,#3988f6);}
.dsh-codex-reasoning-slider-tooltip{position:absolute;top:42px;right:0;background:#1c2330;color:#fff;font:500 11px system-ui,sans-serif;padding:4px 8px;border-radius:6px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .12s;}
.dsh-codex-reasoning-slider-tool:hover .dsh-codex-reasoning-slider-tooltip{opacity:1;}
.dsh-codex-reasoning-slider-status{font:500 12px system-ui,sans-serif;color:var(--dsh-muted,#8a93a6);padding:8px 2px;}
.dsh-codex-reasoning-slider-status.dsh-codex-reasoning-slider-error{color:#d6453b;display:flex;align-items:center;gap:8px;justify-content:space-between;}
.dsh-codex-reasoning-slider-error-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
.dsh-codex-reasoning-slider-menu-back{border:1px solid #d6453b;background:#fff;color:#d6453b;border-radius:7px;padding:3px 8px;cursor:pointer;font:600 12px system-ui,sans-serif;}
.dsh-codex-reasoning-slider-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);}
.dsh-codex-reasoning-slider-popup.message{animation:dsh-codex-reasoning-slider-pop .4s ease;}
@keyframes dsh-codex-reasoning-slider-pop{0%{box-shadow:0 0 0 0 rgba(165,107,233,.5);}100%{box-shadow:0 18px 48px rgba(20,30,60,.18);}}
`;
    /**
     * A root-scoped snapshot store over the host's model catalog, used both by
     * the slider (which reads the same catalog the picker needs) and shared with
     * the model-order settings plugin's data shape.
     */
    function makeCatalogStore(ctx) {
      function errorText(cause) {
        if (cause === null || cause === undefined) return 'unknown error';
        if (typeof cause === 'string') return cause;
        const message = cause.message;
        return typeof message === 'string' && message !== '' ? message : String(cause);
      }
      let snapshot = { current: null, routable: null, groups: [], failures: [], status: 'idle', pending: null, error: null };
      const listeners = new Set();
      const notify = () => listeners.forEach(listener => { try { listener(); } catch {} });
      let inflight = null;
      function load() {
        if (inflight !== null) return inflight;
        snapshot = { ...snapshot, status: snapshot.groups.length ? 'ready' : 'loading', error: null };
        notify();
        const remote = ctx.get('remote');
        const session = remote?.session;
        if (session === undefined || typeof session.modelCatalog !== 'function') {
          snapshot = { ...snapshot, status: 'error', error: 'model catalog is unavailable' };
          notify();
          return Promise.resolve(snapshot);
        }
        inflight = Promise.resolve(session.modelCatalog()).then(response => {
          if (!response || response.ok !== true) {
            const message = response?.error?.message ?? 'model catalog request failed';
            snapshot = { ...snapshot, status: 'error', error: message };
          } else {
            const value = response.value ?? {};
            snapshot = {
              ...snapshot,
              groups: Array.isArray(value.groups) ? value.groups : [],
              failures: Array.isArray(value.failures) ? value.failures : [],
              status: 'ready',
              error: null
            };
          }
          notify();
          return snapshot;
        }, cause => {
          snapshot = { ...snapshot, status: 'error', error: errorText(cause) };
          notify();
          return snapshot;
        }).finally(() => { inflight = null; });
        return inflight;
      }
      return {
        subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
        getSnapshot() { return snapshot; },
        load
      };
    }
    function Selector({ directory, load, select, available, locked, t }) {
      const state = useSyncExternalStore(fn => directory.subscribe(fn), () => directory.getSnapshot());
      // Re-render when the saved order changes (settings page edits it live).
      useSyncExternalStore(subscribeOrder, () => orderSnapshot);
      const [open, setOpen] = useState(false);
      const [present, setPresent] = useState(false);
      const [pane, setPane] = useState('effort');
      // The bolt/particle effect is always on: there is no user-facing toggle.
      const [preview, setPreview] = useState(null);
      const [hovered, setHovered] = useState(-1);
      const [dragging, setDragging] = useState(false);
      const [message, setMessage] = useState(false);
      const [error, setError] = useState('');
      const [busy, setBusy] = useState(false);
      const [query, setQuery] = useState('');
      const rootRef = useRef(null), popupRef = useRef(null), railRef = useRef(null);
      const canvasRef = useRef(null), burstRef = useRef(null), triggerRef = useRef(null);
      const previewRef = useRef(null), dragRef = useRef(false), mountedRef = useRef(true);
      const busyRef = useRef(false);
      const timersRef = useRef([]);
      const latest = useRef({});
      const selection = state.pending || state.current;
      const group = state.groups.find(g => g.id === selection?.provider);
      const model = group?.models.find(m => m.id === selection?.model);
      const efforts = (model?.reasoning?.efforts || []).filter(e => order.includes(e.id))
        .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      const savedEffort = selection?.reasoningEffort || model?.reasoning?.defaultEffort;
      const displayed = preview || savedEffort;
      const index = Math.max(0, efforts.findIndex(e => e.id === displayed));
      const fraction = efforts.length > 1 ? index / (efforts.length - 1) : 1;
      const ultra = displayed === 'max';
      const modelName = model?.name || selection?.model || t('choose');
      const disabled = Boolean(locked || !available);
      const motion = useRef({ speed: 0, from: 0, target: 0, changedAt: 0, travel: 0, burst: 0 });
      latest.current = { open: present, ultra, pane };
      useEffect(() => {
        if (available) load();
      }, [available, load]);
      useLayoutEffect(() => {
        if (open) {
          setPresent(true);
          return;
        }
        const timer = setTimeout(() => setPresent(false), 180);
        return () => clearTimeout(timer);
      }, [open]);
      useEffect(() => {
        mountedRef.current = true;
        return () => {
          mountedRef.current = false;
          timersRef.current.forEach(clearTimeout);
        };
      }, []);
      function enterUltra() {
        timersRef.current.forEach(clearTimeout);
        setMessage(true);
        timersRef.current = [
          setTimeout(() => { motion.current.burst = performance.now(); }, 220),
          setTimeout(() => { if (mountedRef.current) setMessage(false); }, 1800)
        ];
      }
      function showEffort(id) {
        const before = previewRef.current || savedEffort;
        previewRef.current = id;
        setPreview(id);
        if (id === 'max' && before !== 'max') enterUltra();
        else if (id !== 'max') {
          timersRef.current.forEach(clearTimeout);
          motion.current.burst = 0;
          setMessage(false);
        }
      }
      async function commit(next) {
        if (disabled || busyRef.current || !next) return;
        busyRef.current = true;
        setBusy(true);
        setError('');
        try {
          const result = await select(next);
          if (result && !result.ok) throw new Error(result.error?.message || t('failed'));
          if (result === undefined) throw new Error(t('unavailable'));
        } catch (cause) {
          if (mountedRef.current) setError(cause.message || t('failed'));
        } finally {
          busyRef.current = false;
          if (mountedRef.current) {
            setBusy(false);
          }
        }
      }
      function chooseEffort(id) {
        if (id === undefined || disabled || busyRef.current) return;
        commit({ provider: selection?.provider, model: selection?.model, reasoningEffort: id });
      }
      function close() { setOpen(false); }
      function open_() { setPane(model ? 'effort' : 'models'); setOpen(true); load(); }
      // Particle burst on the rail when entering Ultra.
      useEffect(() => {
        if (!present) return;
        const canvas = burstRef.current;
        if (!canvas) return;
        const bctx = canvas.getContext('2d');
        if (!bctx) return;
        const observer = new MutationObserver(() => {});
        observer.observe(popupRef.current, { attributes: true, attributeFilter: ['class'] });
        let frame = 0;
        function draw() {
          bctx.clearRect(0, 0, canvas.width, canvas.height);
          const now = performance.now();
          const age = (now - motion.current.burst) / 1000;
          if (motion.current.burst && age < 0.52 && ultra) {
            for (let i = 0; i < 26; i++) {
              const angle = i * 2.399 + .18;
              const x = 72 + Math.cos(angle) * (43 + (48 + i % 5 * 12) * age * 2);
              const y = 72 + Math.sin(angle) * (43 + (48 + i % 4 * 10) * age * 2);
              bctx.beginPath(); bctx.arc(x, y, (i % 6 === 0 ? 2.3 : 1.35) * 2 * (1 - age), 0, Math.PI * 2);
              bctx.fillStyle = `rgba(165,107,233,${.7 * (1 - age / .52)})`; bctx.fill();
            }
          }
          frame = requestAnimationFrame(draw);
        }
        frame = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(frame); observer.disconnect(); };
      }, [present, ultra]);
      function nearest(event) {
        const box = railRef.current.getBoundingClientRect();
        return Math.round(Math.max(0, Math.min(1, (event.clientX - box.left - 15) / (box.width - 30))) * (efforts.length - 1));
      }
      function pointerDown(event) {
        if (busyRef.current || disabled || efforts.length < 2) return;
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = true; setDragging(true); setHovered(-1);
        showEffort(efforts[nearest(event)].id);
      }
      function pointerMove(event) {
        if (dragRef.current) {
          showEffort(efforts[nearest(event)].id);
        } else {
          const i = nearest(event), box = railRef.current.getBoundingClientRect();
          const tickX = box.left + 15 + i / Math.max(1, efforts.length - 1) * (box.width - 30);
          setHovered(Math.abs(event.clientX - tickX) < 10 && i !== index ? i : -1);
        }
      }
      function finish() {
        if (!dragRef.current) return;
        dragRef.current = false; setDragging(false);
        chooseEffort(previewRef.current);
      }
      function cancelDrag() {
        if (!dragRef.current) return;
        dragRef.current = false;
        setDragging(false);
        previewRef.current = null;
        setPreview(null);
        timersRef.current.forEach(clearTimeout);
        motion.current.burst = 0;
        setMessage(false);
      }
      function keyDown(event) {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next++;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next--;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = efforts.length - 1;
        else return;
        event.preventDefault();
        chooseEffort(efforts[Math.max(0, Math.min(efforts.length - 1, next))]?.id);
      }
      function chooseModel(provider, nextModel) {
        if (disabled || busyRef.current) return;
        const same = selection?.provider === provider && selection?.model === nextModel.id;
        const id = same ? savedEffort : nextModel.reasoning?.defaultEffort;
        setPane('effort');
        timersRef.current.forEach(clearTimeout);
        motion.current.burst = 0;
        setMessage(false);
        void commit({ provider, model: nextModel.id, ...(id ? { reasoningEffort: id } : {}) });
      }
      function modelKeyDown(event) {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        const options = [...popupRef.current.querySelectorAll('.dsh-codex-reasoning-slider-modelsList button:not(:disabled)')];
        if (!options.length) return;
        event.preventDefault();
        const active = options.indexOf(document.activeElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
          : (active + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[next].focus({ preventScroll: true });
        options[next].scrollIntoView({ block: 'nearest' });
      }
      const classes = `dsh-codex-reasoning-slider-popup${!open ? ' closed' : ''}${ultra ? ' ultra' : ''} fast-mode${message ? ' message' : ''}`;
      const status = error || state.error || '';
      const currentLabel = labels[displayed] || state.retainedEffort || '';
      const triggerLabel = labels[savedEffort] || state.retainedEffort || '';
      const modelCount = state.groups.reduce((count, provider) => count + provider.models.length, 0);
      const needle = query.trim().toLowerCase();
      const orderedGroups = applyOrder(state.groups, orderSnapshot);
      const filteredGroups = needle === '' ? orderedGroups : orderedGroups
        .map(provider => ({ ...provider, models: provider.models.filter(option => (option.name || option.id).toLowerCase().includes(needle)) }))
        .filter(provider => provider.models.length > 0);
      const filteredCount = filteredGroups.reduce((count, provider) => count + provider.models.length, 0);
      const showSearch = modelCount > 4;
      // Native caps the picker at min(360px, 100vh - 96px) and scrolls the list;
      // an uncapped height makes the panel taller than the viewport.
      const desiredHeight = 34 + Math.max(1, modelCount) * 30 + (state.groups.length > 1 ? state.groups.length * 22 : 0) + (showSearch ? 32 : 0);
      const menuHeight = Math.min(desiredHeight, 360);
      useEffect(() => {
        if (pane !== 'models') setQuery('');
      }, [pane]);
      const modelsView = h('div', { className: `dsh-codex-reasoning-slider-pane dsh-codex-reasoning-slider-models${pane !== 'models' ? ' hidden' : ''}`,
        role: 'menu', 'aria-label': t('model'), inert: pane !== 'models' ? '' : undefined, onKeyDown: modelKeyDown },
        h('div', { className: 'dsh-codex-reasoning-slider-searchRow' },
          h('button', { className: 'dsh-codex-reasoning-slider-searchBack', type: 'button', 'aria-label': t('back'), title: t('back'), onClick: () => setPane('effort') }, icon('back', true)),
          showSearch ? h('div', { className: `dsh-codex-reasoning-slider-search${query !== '' ? ' dsh-codex-reasoning-slider-searchWithQuery' : ''}` },
            icon('search', true),
            h('input', { className: 'dsh-codex-reasoning-slider-searchInput', type: 'text', role: 'searchbox', value: query, placeholder: t('search'),
              'aria-label': t('search'), spellCheck: false, autoComplete: 'off',
              onChange: event => setQuery(event.currentTarget.value),
              onKeyDown: event => { if (event.key === 'Escape' && query !== '') { event.preventDefault(); event.stopPropagation(); setQuery(''); } }
            }),
            query !== '' ? h('button', { className: 'dsh-codex-reasoning-slider-searchClear', type: 'button', 'aria-label': t('search'), title: t('search'),
              onClick: () => setQuery('') }, '×') : null) : null),
        h('div', { className: 'dsh-codex-reasoning-slider-modelsList' },
          ...filteredGroups.map(provider => h('div', { key: provider.id },
            filteredGroups.length > 1 ? h('div', { className: 'dsh-codex-reasoning-slider-group' }, provider.name) : null,
            ...provider.models.map(option => h('button', {
              key: option.id, className: 'dsh-codex-reasoning-slider-option', role: 'menuitemradio',
              'aria-checked': selection?.provider === provider.id && selection?.model === option.id,
              disabled: busy, onClick: () => chooseModel(provider.id, option)
            }, h('span', { className: 'dsh-codex-reasoning-slider-option-name', title: option.name }, option.name),
            selection?.provider === provider.id && selection?.model === option.id ? icon('check', true) : null)))),
          !state.groups.length ? h('div', { className: 'dsh-codex-reasoning-slider-status' }, state.status === 'loading' ? t('loading') : t('empty'))
            : (filteredCount === 0 ? h('div', { className: 'dsh-codex-reasoning-slider-status' }, t('noMatch')) : null)));
      return h('div', { className: 'dsh-codex-reasoning-slider-root', ref: rootRef, 'data-dsh-codex-reasoning-slider-session': true },
        h('style', null, styles),
        h('button', { className: `dsh-codex-reasoning-slider-trigger${savedEffort === 'max' ? ' ultra' : ''}`, ref: triggerRef, disabled,
          'aria-label': `${modelName} ${triggerLabel}`, 'aria-expanded': open, 'aria-haspopup': 'dialog', 'aria-busy': busy,
          onClick: () => {
            if (open) close();
            else { setPane(model ? 'effort' : 'models'); setOpen(true); load(); }
          }
        }, h('svg', { className: 'dsh-codex-reasoning-slider-trigger-bolt', viewBox: '0 0 24 24', 'aria-hidden': true },
          h('path', { d: 'M14.4 2Q16 .2 15.8 2.5L15.1 8.5H20.5Q22 8.5 21 9.8L10.7 21.7Q9 23.4 9.2 21.2L10 14.2H4.2Q2.6 14.2 3.6 12.9L14.4 2Z' })),
        h('span', { className: 'dsh-codex-reasoning-slider-compact' }, icon('model')),
        h('span', { className: 'dsh-codex-reasoning-slider-caption' }, modelName,
          triggerLabel ? h('span', { className: 'dsh-codex-reasoning-slider-trigger-effort' }, ` ${triggerLabel}`) : null), icon('down', true)),
        h('section', { className: classes, ref: popupRef, role: 'dialog', 'aria-label': pane === 'models' ? t('model') : t('effort'),
          'aria-hidden': !open, inert: !open ? '' : undefined, style: { '--dsh-codex-reasoning-slider-height': `${pane === 'models' ? menuHeight : 104}px` } },
          modelsView,
          h('div', { className: `dsh-codex-reasoning-slider-pane dsh-codex-reasoning-slider-main${pane !== 'effort' ? ' hidden' : ''}`, inert: pane !== 'effort' ? '' : undefined },
            h('button', { className: 'dsh-codex-reasoning-slider-model-link', onClick: () => setPane('models'), 'aria-label': t('model'), title: modelName },
              h('span', { className: 'dsh-codex-reasoning-slider-heading' }, currentLabel || t('choose'), icon('chevron', true)),
              h('span', { className: 'dsh-codex-reasoning-slider-model' }, modelName)),
            h('div', { className: 'dsh-codex-reasoning-slider-warning' }, h('span', null, t('warning'))),
            h('button', { className: 'dsh-codex-reasoning-slider-tool dsh-codex-reasoning-slider-reset', disabled: busy || !model?.reasoning, 'aria-label': t('reset'),
              onClick: () => { chooseEffort(model?.reasoning?.defaultEffort); }
            }, icon('reset'), h('span', { className: 'dsh-codex-reasoning-slider-tooltip', role: 'tooltip' }, t('reset'))),
            efforts.length ? h('div', { className: `dsh-codex-reasoning-slider-rail${dragging ? ' dragging' : ''}${efforts.length < 2 ? ' dsh-codex-reasoning-slider-railSingle' : ''}`, ref: railRef,
              style: { '--dsh-codex-reasoning-slider-pos': fraction }, role: 'slider', tabIndex: 0,
              'aria-label': t('effort'), 'aria-valuemin': 0, 'aria-valuemax': efforts.length - 1,
              'aria-valuenow': index, 'aria-valuetext': currentLabel, 'aria-disabled': busy || disabled,
              onPointerDown: pointerDown, onPointerMove: pointerMove, onPointerUp: finish,
              onPointerCancel: cancelDrag, onLostPointerCapture: cancelDrag,
              onPointerLeave: () => setHovered(-1), onKeyDown: keyDown
            }, h('div', { className: 'dsh-codex-reasoning-slider-fill' }),
              ...(efforts.length > 1 ? efforts.map((effort, i) => h('i', { key: effort.id,
                className: `dsh-codex-reasoning-slider-dot${i <= index ? ' passed' : ''}${i < index ? ' covered' : ''}${hovered === i ? ' hovered' : ''}`,
                style: { '--dsh-codex-reasoning-slider-tick': i / (efforts.length - 1) } })) : []),
              h('div', { className: 'dsh-codex-reasoning-slider-sparks' }, h('canvas', { ref: canvasRef, className: 'dsh-codex-reasoning-slider-particles', width: 496, height: 52 })),
              h('div', { className: 'dsh-codex-reasoning-slider-knob' }), h('canvas', { ref: burstRef, className: 'dsh-codex-reasoning-slider-burst', width: 144, height: 144 }))
              : h('div', { className: 'dsh-codex-reasoning-slider-noeffort' }, t('unsupported'))),
          busy ? h('div', { className: 'dsh-codex-reasoning-slider-sr', role: 'status' }, t('busy')) : null,
          status ? h('div', { className: 'dsh-codex-reasoning-slider-status dsh-codex-reasoning-slider-error', role: 'alert' },
            h('span', { className: 'dsh-codex-reasoning-slider-error-text', title: status }, status),
            h('button', { className: 'dsh-codex-reasoning-slider-menu-back', 'aria-label': t('retry'), title: t('retry'),
              onClick: () => { setError(''); load(); } }, icon('reset', true))) : null));
    }
    return {
      inject: ['slots', 'modelDirectories', 'sessions', 'locale', 'remote', 'remote.session'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }));
        ctx.slots.inject('conversation.input.model', () => ctx.slots.register({
          name: 'conversation.input.model',
          priority: -1,
          locale: NS,
          inject(sessionId) {
            const directory = ctx.modelDirectories.directoryFor(sessionId);
            const available = ctx.sessions.subagentAddress(sessionId) === undefined;
            return {
              available, directory: directory.store,
              load: () => { if (available) directory.load().catch(() => {}); },
              select: selection => available ? directory.select(selection) : Promise.resolve(undefined)
            };
          }
        }, Selector));
      }
    };
  }
});
