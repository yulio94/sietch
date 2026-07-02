import { createCommandPalette } from "./components/command-palette/command-palette";
import { createEditor } from "./components/editor/editor";
import { createInspector } from "./components/inspector/inspector";
import { createSidebar } from "./components/sidebar/sidebar";
import { createStartScreen } from "./components/start-screen/start-screen";
import { createStatusbar } from "./components/statusbar/statusbar";
import { createThemeToggle } from "./components/theme-toggle/theme-toggle";
import { bus } from "./core/bus";
import { store } from "./core/store";
import { getLL, initI18n, resolveLocale } from "./i18n";
import { loadConfig } from "./services/config";
import { initShortcuts } from "./services/shortcuts";
import { initSplitPanels } from "./services/split-panels";
import type { Doc } from "./types";

function buildLayout(): HTMLElement {
	const app = document.createElement("div");
	app.className = "app";

	const sidebarSlot = document.createElement("div");
	sidebarSlot.id = "slot-sidebar";

	const divider1 = document.createElement("div");
	divider1.className = "divider";

	const editorSlot = document.createElement("div");
	editorSlot.id = "slot-editor";
	editorSlot.style.display = "flex";
	editorSlot.style.flexDirection = "column";
	editorSlot.style.overflow = "hidden";

	const divider2 = document.createElement("div");
	divider2.className = "divider";

	const inspectorSlot = document.createElement("div");
	inspectorSlot.id = "slot-inspector";

	app.appendChild(sidebarSlot);
	app.appendChild(divider1);
	app.appendChild(editorSlot);
	app.appendChild(divider2);
	app.appendChild(inspectorSlot);

	return app;
}

function seedDemoData(): Doc[] {
	const LL = getLL();
	return [
		{
			id: "1",
			title: "Chapter One",
			content:
				"<h1>Chapter One</h1><p>Start writing here. This is a sample chapter to show how the editor renders headings, paragraphs, and formatting.</p><h2>A section</h2><p>Use headings to structure your manuscript. The outline panel picks them up automatically.</p>",
			preview: "Start writing here. This is a sample chapter...",
			meta: LL.justNow(),
			notes: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "2",
			title: "Chapter Two",
			content:
				"<h1>Chapter Two</h1><p>Another sample chapter. Replace this text with your own writing.</p><h2>Notes</h2><p>Each document keeps its own notes and word count.</p>",
			preview: "Another sample chapter. Replace this text...",
			meta: "2 hours ago",
			notes: "Sample note",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "3",
			title: "Chapter Three",
			content:
				"<h1>Chapter Three</h1><p>A third sample chapter so the sidebar has a few entries to display.</p>",
			preview: "A third sample chapter...",
			meta: "Yesterday",
			notes: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];
}

async function detectSystemLocale(): Promise<string> {
	try {
		const { locale } = await import("@tauri-apps/plugin-os");
		const sysLocale = await locale();
		if (sysLocale) return sysLocale;
	} catch {
		// Not running in Tauri (e.g. browser-only dev) — fall back
	}
	return navigator.language;
}

function mountEditorLayout(
	root: HTMLElement,
	config: Awaited<ReturnType<typeof loadConfig>>,
) {
	const LL = getLL();
	const app = buildLayout();

	// Clear the start screen safely using DOM API
	while (root.firstChild) {
		root.removeChild(root.firstChild);
	}
	root.appendChild(app);

	// Mount components into slots
	const sidebarEl = app.querySelector("#slot-sidebar") as HTMLElement;
	const editorEl = app.querySelector("#slot-editor") as HTMLElement;
	const inspectorEl = app.querySelector("#slot-inspector") as HTMLElement;
	createSidebar(sidebarEl);
	createEditor(editorEl);
	createInspector(inspectorEl);
	createStatusbar(editorEl);
	createCommandPalette();

	// Init services
	initShortcuts();
	initSplitPanels(app, config.sidebarWidth, config.inspectorWidth);

	// Seed demo data
	const docs = seedDemoData();
	store.set("documents", docs);
	store.set("activeDoc", docs[0]);
	bus.emit("document:load", docs[0]);

	// Handle new document creation
	bus.on("document:new", () => {
		const allDocs = store.get("documents");
		const newDoc: Doc = {
			id: String(Date.now()),
			title: LL.untitled(),
			content: "",
			preview: "",
			meta: LL.justNow(),
			notes: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		store.set("documents", [newDoc, ...allDocs]);
		store.set("activeDoc", newDoc);
		bus.emit("document:load", newDoc);
	});
}

async function bootstrap() {
	const root = document.getElementById("app");
	if (!root) return;

	// Detect locale and init i18n before mounting any component
	const bcp47 = await detectSystemLocale();
	const systemLocale = resolveLocale(bcp47);
	initI18n(systemLocale);

	// Load persisted config (populates the reactive store)
	const config = await loadConfig();

	// If persisted locale differs from system locale, re-init i18n
	const appLocale = resolveLocale(config.locale);
	if (appLocale !== systemLocale) {
		initI18n(appLocale);
	}
	document.documentElement.lang = appLocale;

	// Theme toggle lives on document.body — visible on all screens
	createThemeToggle();

	// Show start screen — editor mounts only after a project is loaded
	createStartScreen(root);

	bus.on("project:loaded", () => {
		mountEditorLayout(root, config);
	});
}

bootstrap();
