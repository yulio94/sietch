# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sietch is a Tauri v2 desktop writing editor using vanilla TypeScript for the frontend and Rust for the backend. It uses TipTap v3 as a rich text editor with a warm sand/stone design system.

## Commands

```bash
# Install frontend dependencies
pnpm install

# Development (launches both Vite dev server and Tauri window)
pnpm tauri dev

# Build production app
pnpm tauri build

# Frontend-only dev server (no Tauri window, runs on port 1420)
pnpm dev

# Lint and format (Biome — checks formatting, linting, and import sorting)
pnpm check
pnpm check:fix    # auto-fix
pnpm format        # format only

# Type check
tsc --noEmit

# Rust checks (run from src-tauri/)
cargo check
cargo clippy
cargo test
```

## Architecture

**Two-process model:** Tauri apps run a Rust backend process and a webview frontend. They communicate via Tauri's command/invoke system.

### Frontend Structure

```
src/
├── main.ts                          # Bootstrap: builds DOM, mounts components, seeds data
├── types/
│   ├── index.ts                     # Doc, EditorStats, OutlineItem, CommandItem, StoreState, BusEvents
│   └── css-modules.d.ts             # Ambient types for *.module.css imports
├── core/
│   ├── store.ts                     # Reactive key-value store (.get/.set/.on)
│   └── bus.ts                       # Typed event bus (.emit/.on)
├── components/
│   ├── sidebar/                     # Document list, project title, new doc button
│   ├── editor/                      # TipTap v3 editor, focus mode, stats/outline computation
│   ├── statusbar/                   # Word count, progress bar, reading time
│   ├── inspector/                   # Stats grid, document outline, notes textarea
│   ├── command-palette/             # Cmd+K fuzzy search overlay (fuse.js)
│   └── theme-toggle/               # Dark/light toggle button
├── services/
│   ├── shortcuts.ts                 # Global hotkeys (hotkeys-js)
│   └── split-panels.ts             # Resizable panel dividers (split-grid)
└── styles/
    ├── theme.css                    # Design tokens, reset, shared components, animations
    └── styles.css                   # App grid layout only (4 selectors)
```

### Backend Structure

- `src-tauri/src/main.rs` — Entry point, calls `sietch_lib::run()`.
- `src-tauri/src/lib.rs` — Tauri builder, command handlers.
- `src-tauri/tauri.conf.json` — Window settings, build commands, security policies.
- `src-tauri/capabilities/default.json` — Tauri v2 permission system.

### Component Pattern

Each component follows the same pattern:

```typescript
// component-name.ts + component-name.module.css
import { store } from "../../core/store";
import { bus } from "../../core/bus";
import styles from "./component-name.module.css";

export function createComponentName(container: HTMLElement) {
  // 1. Build DOM using document.createElement (safe, no innerHTML with user data)
  // 2. Append to container
  // 3. Subscribe to store changes with store.on(key, callback)
  // 4. Emit bus events for cross-cutting concerns
}
```

### Data Flow

- **Editor → Store → UI**: Editor `onUpdate` pushes stats/outline to store. Statusbar and inspector subscribe to store changes.
- **Bus for commands**: Cross-cutting events like `document:new`, `panel:toggle-sidebar`, `palette:open` go through the event bus.
- **Store API**: `store.get(key)`, `store.set(key, value)`, `store.on(key, callback)` — callback returns unsubscribe function.
- **Bus API**: `bus.emit(event, data?)`, `bus.on(event, handler)` — handler returns unsubscribe function.

### Key Dependencies

- **Frontend**: `@tauri-apps/api` (IPC), `@tiptap/*` (editor), `hotkeys-js` (shortcuts), `fuse.js` (command palette search), `split-grid` (resizable panels), `date-fns` (timestamps)
- **Backend**: `tauri`, `tauri-plugin-opener`, `serde`/`serde_json`

### CSS Strategy

- **`theme.css`** — Design tokens (sand palette, accent colors), CSS reset, shared components (`.btn-icon`, `.divider`), animations.
- **`styles.css`** — Only the `.app` grid layout rules.
- **CSS Modules** — Each component has its own `.module.css` file. Vite hashes class names automatically. `localsConvention: "camelCaseOnly"` in vite.config.ts.

## Coding Conventions

- **Language**: All code, comments, doc comments, error messages, variable names, and commit messages must be written in **English**, regardless of the language of the prompt. The only exception is i18n locale files (e.g., `src/i18n/es/index.ts`), which contain translations in their respective languages.
- **Formatter**: Biome with tab indentation and double quotes.
- **TypeScript**: Strict mode with `noUnusedLocals` and `noUnusedParameters`. Target ES2020.
- **DOM construction**: Use `document.createElement` for safe DOM building. Avoid `innerHTML` with user/dynamic content.
- **Imports**: Sorted by Biome. Core/bus imports use `../../core/` paths from components.

## Frontend → Backend Communication

Use `invoke()` from `@tauri-apps/api/core` in TypeScript to call functions decorated with `#[tauri::command]` in Rust. New commands must be registered in `tauri::generate_handler![]` in `lib.rs`.
