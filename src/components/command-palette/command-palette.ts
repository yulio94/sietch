import Fuse from "fuse.js";
import { bus } from "../../core/bus";
import { getLL } from "../../i18n";
import type { CommandItem } from "../../types";
import styles from "./command-palette.module.css";

let overlay: HTMLElement | null = null;

function getCommands(): CommandItem[] {
	const LL = getLL();
	return [
		{
			id: "new-doc",
			category: LL.catDocument(),
			label: LL.cmdNewDocument(),
			shortcut: "Cmd+N",
			action: () => bus.emit("document:new"),
		},
		{
			id: "toggle-sidebar",
			category: LL.catView(),
			label: LL.cmdToggleSidebar(),
			shortcut: "Cmd+\\",
			action: () => bus.emit("panel:toggle-sidebar"),
		},
		{
			id: "toggle-inspector",
			category: LL.catView(),
			label: LL.cmdToggleInspector(),
			shortcut: "Cmd+Shift+I",
			action: () => bus.emit("panel:toggle-inspector"),
		},
		{
			id: "toggle-focus",
			category: LL.catView(),
			label: LL.cmdToggleFocusMode(),
			shortcut: "Cmd+Shift+F",
			action: () => bus.emit("focus:toggle"),
		},
		{
			id: "toggle-theme",
			category: LL.catView(),
			label: LL.cmdToggleTheme(),
			action: () => bus.emit("theme:toggle"),
		},
	];
}

function close() {
	if (overlay) {
		overlay.remove();
		overlay = null;
	}
}

function renderResults(
	resultsEl: HTMLElement,
	items: CommandItem[],
	selectedIndex: number,
) {
	resultsEl.textContent = "";
	items.forEach((cmd, i) => {
		const item = document.createElement("div");
		item.className = i === selectedIndex ? styles.itemSelected : styles.item;

		const left = document.createElement("div");
		left.className = styles.itemLeft;

		const cat = document.createElement("span");
		cat.className = styles.category;
		cat.textContent = cmd.category;

		const label = document.createElement("span");
		label.className = styles.label;
		label.textContent = cmd.label;

		left.appendChild(cat);
		left.appendChild(label);
		item.appendChild(left);

		if (cmd.shortcut) {
			const shortcut = document.createElement("span");
			shortcut.className = styles.shortcut;
			shortcut.textContent = "";
			const keys = cmd.shortcut.split("+");
			for (const key of keys) {
				const kbd = document.createElement("kbd");
				kbd.textContent = key;
				shortcut.appendChild(kbd);
			}
			item.appendChild(shortcut);
		}

		item.addEventListener("click", () => {
			close();
			cmd.action();
		});

		resultsEl.appendChild(item);
	});
}

function open() {
	if (overlay) return;

	const LL = getLL();
	const commands = getCommands();
	const fuse = new Fuse(commands, {
		keys: ["label", "category"],
		threshold: 0.4,
	});

	overlay = document.createElement("div");
	overlay.className = styles.overlay;

	const palette = document.createElement("div");
	palette.className = styles.palette;

	const input = document.createElement("input");
	input.className = styles.input;
	input.placeholder = LL.commandPlaceholder();
	input.type = "text";

	const results = document.createElement("div");
	results.className = styles.results;

	palette.appendChild(input);
	palette.appendChild(results);
	overlay.appendChild(palette);
	document.body.appendChild(overlay);

	let selectedIndex = 0;
	let filtered = commands;

	renderResults(results, filtered, selectedIndex);
	input.focus();

	input.addEventListener("input", () => {
		const query = input.value.trim();
		filtered = query ? fuse.search(query).map((r) => r.item) : commands;
		selectedIndex = 0;
		renderResults(results, filtered, selectedIndex);
	});

	input.addEventListener("keydown", (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
			renderResults(results, filtered, selectedIndex);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
			renderResults(results, filtered, selectedIndex);
		} else if (e.key === "Enter" && filtered[selectedIndex]) {
			e.preventDefault();
			close();
			filtered[selectedIndex].action();
		} else if (e.key === "Escape") {
			e.preventDefault();
			close();
		}
	});

	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) close();
	});
}

export function createCommandPalette() {
	bus.on("palette:open", open);
	bus.on("palette:close", close);
}
