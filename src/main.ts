import { createCommandPalette } from "./components/command-palette/command-palette";
import { createEditor } from "./components/editor/editor";
import { createInspector } from "./components/inspector/inspector";
import { createSidebar } from "./components/sidebar/sidebar";
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
			title: "The Spice Must Flow",
			content:
				"<h1>The Spice Must Flow</h1><p>The spice melange is the most essential and valuable commodity in the universe. Found only on the desert planet Arrakis, it grants extended life, expanded consciousness, and is vital to space travel.</p><h2>Properties of Melange</h2><p>The spice has geriatric properties that extend human life. Guild Navigators use it to fold space, enabling interstellar travel without computers. The Bene Gesserit use it to unlock genetic memory.</p><p>He who controls the spice controls the universe.</p>",
			preview: "The spice melange is the most essential...",
			meta: LL.justNow(),
			notes: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "2",
			title: "Arrakis — Desert Planet",
			content:
				"<h1>Arrakis — Desert Planet</h1><p>Arrakis, also known as Dune, is the third planet orbiting the star Canopus. It is a harsh, arid world with virtually no rainfall, yet it holds the key to human civilization.</p><h2>The Sandworms</h2><p>Shai-Hulud, the great sandworms of Arrakis, are the source of the spice. They are territorial creatures of immense size, some exceeding 400 meters in length.</p>",
			preview: "Arrakis, also known as Dune...",
			meta: "2 hours ago",
			notes: "Research Fremen water discipline",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "3",
			title: "The Fremen Way",
			content:
				"<h1>The Fremen Way</h1><p>The Fremen are the native people of Arrakis. Their entire culture revolves around the conservation of water, which they consider sacred.</p><p>A sietch is the name for a Fremen community, typically hidden in the rocky formations of the desert.</p>",
			preview: "The Fremen are the native people...",
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

	const LL = getLL();

	const app = buildLayout();
	root.appendChild(app);

	// Mount components into slots — elements exist because buildLayout() just created them
	const sidebarEl = app.querySelector("#slot-sidebar") as HTMLElement;
	const editorEl = app.querySelector("#slot-editor") as HTMLElement;
	const inspectorEl = app.querySelector("#slot-inspector") as HTMLElement;
	createSidebar(sidebarEl);
	createEditor(editorEl);
	createInspector(inspectorEl);
	createStatusbar(editorEl);
	createCommandPalette();
	createThemeToggle();

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

bootstrap();
