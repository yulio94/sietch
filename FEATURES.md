# Sietch — Feature Tracker

Last updated: 2026-07-01

---

## Phase 1 — MVP

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| F-001 | Create project | Create a new project: generates a folder with `sietch.json`, `chapters/`, `notes/`, `.sietch/` | 🟢 Done |
| F-002 | Open project | Open an existing project by selecting a folder. Read `sietch.json` and load the structure | 🟢 Done |
| F-003 | Recent projects | Remember the last opened projects for quick access from the start screen | 🔲 Todo |
| F-004 | TipTap editor | Rich editor with StarterKit: headings, bold, italic, blockquote, code, lists, dividers | 🟢 Done |
| F-005 | Sidebar tree | Side panel with the project's hierarchical structure (folders → chapters) with expand/collapse | 🟡 In Progress |
| F-006 | Read chapter | Load a `.md` file from the filesystem and render it in the editor when clicking in the sidebar | 🔲 Todo |
| F-007 | Save chapter | Convert the editor content to markdown and write it to disk | 🔲 Todo |
| F-008 | Autosave | Automatic save every 30 seconds or when switching chapters. Visual status indicator | 🔲 Todo |
| F-009 | Create chapter | Create a new `.md` file in `chapters/`, update `sietch.json` with the ordering | 🔲 Todo |
| F-010 | Dark theme | Dark theme: dark sand background, light text, blue accents | 🟢 Done |
| F-011 | SQLite init | Create the `.sietch/sietch.db` database when creating a project, with tables for stats and metadata | 🟢 Done |
| F-012 | Formatting toolbar | Formatting bar above the editor: bold, italic, heading 1-3, blockquote, list, code | 🔲 Todo |

---

## Phase 2

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| F-020 | Delete chapter | Move a chapter to `trash/` (soft delete), update `sietch.json` | 🔲 Todo |
| F-021 | Rename chapter | Rename the `.md` file and update the reference in `sietch.json` | 🔲 Todo |
| F-022 | Reorder chapters | Drag & drop in the sidebar to change order. Persist to `sietch.json` | 🔲 Todo |
| F-023 | Project notes | Side panel of notes linked to the project. CRUD of files in `notes/` | 🔲 Todo |
| F-024 | Word counter | Word count in the status bar: words in the current chapter, project total, words per session | 🟡 In Progress |
| F-025 | Light theme | Light theme: cream/sand background, dark text, orange/terracotta accents | 🟢 Done |
| F-026 | Theme toggle | Switch between light and dark themes. Persist the preference | 🟢 Done |
| F-027 | Full-text search | Full-text search across all `.md` files in the project. Results with preview and navigation | 🔲 Todo |
| F-028 | Keyboard shortcuts | Cmd/Ctrl+S save, Cmd/Ctrl+N new chapter, Cmd/Ctrl+P search, Cmd/Ctrl+B/I formatting | 🟡 In Progress |
| F-029 | Per-chapter synopsis | Short synopsis field per chapter (stored in `sietch.json`). Visible in outline and corkboard | 🔲 Todo |
| F-030 | Per-chapter tags | Tags with assignable colors per chapter (POV, subplot, timeline). Stored in metadata | 🔲 Todo |

---

## Phase 3

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| F-040 | Corkboard view | Corkboard-style card view: each chapter/scene as a card with title, synopsis, tags and color | 🔲 Todo |
| F-041 | Outline mode | Outline view: only titles and synopses of each chapter in a collapsible list. Inline synopsis editing | 🔲 Todo |
| F-042 | Focus mode | Distraction-free writing mode: full screen, editor only, clean background. Toggle with Esc | 🔲 Todo |
| F-043 | Typewriter mode | Active line always vertically centered in the editor. Toggle in settings | 🔲 Todo |
| F-044 | Writing goals | Set a daily/weekly word target. Visual progress bar | 🔲 Todo |
| F-045 | Writing streaks | Track consecutive writing days. Visual indicator in the status bar or dashboard | 🔲 Todo |
| F-046 | Statistics dashboard | Words per chapter (bar chart), progress over time, sessions | 🔲 Todo |
| F-047 | Session logging | Log every writing session: date, duration, words written. Store in SQLite | 🔲 Todo |
| F-048 | Export PDF | Compile the full project or a selection of chapters to PDF with clean formatting | 🔲 Todo |
| F-049 | Export DOCX | Compile to standard Word format to send to editors/agents | 🔲 Todo |
| F-050 | Export EPUB | Compile to an ebook with metadata (title, author, cover) | 🔲 Todo |
| F-051 | Compilation templates | Predefined export profiles: manuscript (Courier, double-spaced), ebook, draft | 🔲 Todo |
| F-052 | File watcher | Detect external changes to `.md` files and reload in the editor if needed | 🔲 Todo |

---

## Phase 4

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| F-060 | Encyclopedia | Internal project wiki: entries for characters, places, objects, events | 🔲 Todo |
| F-061 | Bidirectional links | Link mentions in chapters to encyclopedia entries. Click to navigate | 🔲 Todo |
| F-062 | Visual timeline | Timeline of project events. Drag to reorder. Link to chapters | 🔲 Todo |
| F-063 | Sync — Git | Automatic sync via Git: commit per session, push/pull to remote. Simple UI without needing to know Git | 🔲 Todo |
| F-064 | Sync — Cloud | Alternative: sync to Cloudflare R2 or S3. Basic conflict resolution | 🔲 Todo |
| F-065 | Snapshots | Manual versioning: save a named snapshot of the project's current state. Restore | 🔲 Todo |
| F-066 | AI pacing analysis | Analyze the manuscript's pacing, detect slow chapters, suggest structure | 🔲 Todo |
| F-067 | AI summaries | Generate an automatic summary of each chapter for quick reference | 🔲 Todo |
| F-068 | AI consistency | Detect inconsistencies: names, physical descriptions, timeline, locations | 🔲 Todo |
| F-069 | AI continuity suggestions | When opening a chapter, show context of what happened before to resume writing | 🔲 Todo |

---

## Backlog (nice to have, no phase assigned)

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| F-080 | Import Scrivener | Import `.scriv` projects, converting them to the Sietch structure | 🔲 Todo |
| F-081 | Import Word/MD | Import standalone `.docx` or `.md` files as chapters | 🔲 Todo |
| F-082 | Plugin system | Extension system to add custom functionality | 🔲 Todo |
| F-083 | Multiple projects | Have several projects open in tabs or separate windows | 🔲 Todo |
| F-084 | Split editor | Two editor panels side by side for reference while writing | 🔲 Todo |
| F-085 | Custom fonts | Let the user choose the editor typeface | 🔲 Todo |
| F-086 | Markdown preview | Toggle to view rendered markdown vs raw | 🔲 Todo |
| F-087 | Image support | Insert images into chapters. Store in the project's `assets/` folder | 🔲 Todo |
| F-088 | Start screen | Welcome screen with recent projects, create new, open existing | 🟡 In Progress |
| F-089 | Character sheets | Structured templates for character sheets within the encyclopedia | 🔲 Todo |
| F-090 | Mobile companion | Mobile version with Tauri 2.0 to read/edit on the phone | 🔲 Todo |

---

## Status legend

| Emoji | Status |
|-------|--------|
| 🔲 | Todo — pending |
| 🟡 | In Progress — under development |
| 🟢 | Done — completed |
| ⏸️ | Paused — on hold |
| ❌ | Dropped — discarded |

---

## Notes

- Priority is always completing Phase 1 before moving forward
- Each feature can be split into sub-tasks if it's too large
- The ID is fixed; it's not reused if a feature is removed
- Side project = no deadlines, but with order

---

## Validation — 2026-07-01

State verified against the code (`src/`, `src-tauri/src/`):

- **Done:** F-001, F-002 (Rust `create_project`/`open_project` + start-screen create/open flows), F-004 (TipTap StarterKit + Typography + CharacterCount + Placeholder), F-010/F-025/F-026 (light+dark themes with persisted toggle), F-011 (`initialize_db` creates `.sietch/sietch.db` with `writing_sessions`, `word_counts`, `project_meta` tables).
- **In Progress:** F-005 (sidebar renders a flat document list, not a filesystem folder tree with expand/collapse), F-024 (status bar shows current-chapter word count only — no project total or per-session count), F-028 (Cmd+K/N and panel toggles wired; Cmd+S save, Cmd+P search not wired — B/I handled by TipTap), F-088 (start screen exists but has no recent-projects list, see F-003).
- **Not started, but note:** chapters are **not** persisted yet. The editor runs on in-memory demo data (`seedDemoData`); F-006/F-007/F-008/F-009/F-012 all still require wiring the editor to the filesystem.
- **Present but untracked:** i18n (en/es), config persistence (`tauri-plugin-store`), resizable split panels, command palette (Cmd+K), inspector panel.
