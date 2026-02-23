import { bus } from "../../core/bus";
import { store } from "../../core/store";
import { getLL } from "../../i18n";
import type { EditorStats, OutlineItem } from "../../types";
import styles from "./inspector.module.css";

export function createInspector(container: HTMLElement) {
	const LL = getLL();

	const inspector = document.createElement("div");
	inspector.className = styles.inspector;

	// Stats section
	const statsSection = document.createElement("div");
	statsSection.className = styles.section;
	const statsTitle = document.createElement("h3");
	statsTitle.className = styles.sectionTitle;
	statsTitle.textContent = LL.statistics();
	const statGrid = document.createElement("div");
	statGrid.className = styles.statGrid;
	statsSection.appendChild(statsTitle);
	statsSection.appendChild(statGrid);

	// Create stat cards
	const cards = createStatCards(statGrid, LL);

	// Outline section
	const outlineSection = document.createElement("div");
	outlineSection.className = styles.section;
	const outlineTitle = document.createElement("h3");
	outlineTitle.className = styles.sectionTitle;
	outlineTitle.textContent = LL.outline();
	const outlineList = document.createElement("ul");
	outlineList.className = styles.outlineList;
	outlineSection.appendChild(outlineTitle);
	outlineSection.appendChild(outlineList);

	// Notes section
	const notesSection = document.createElement("div");
	notesSection.className = styles.section;
	const notesTitle = document.createElement("h3");
	notesTitle.className = styles.sectionTitle;
	notesTitle.textContent = LL.notes();
	const notesInput = document.createElement("textarea");
	notesInput.className = styles.notesInput;
	notesInput.placeholder = LL.notesPlaceholder();
	notesSection.appendChild(notesTitle);
	notesSection.appendChild(notesInput);

	inspector.appendChild(statsSection);
	inspector.appendChild(outlineSection);
	inspector.appendChild(notesSection);
	container.appendChild(inspector);

	// Notes save on input
	notesInput.addEventListener("input", () => {
		const doc = store.get("activeDoc");
		if (doc) {
			doc.notes = notesInput.value;
			store.set("activeDoc", doc);
		}
	});

	// Load notes when doc changes
	store.on("activeDoc", (doc) => {
		notesInput.value = doc?.notes ?? "";
	});

	// Update stats
	store.on("stats", (stats: EditorStats) => {
		cards.words.textContent = String(stats.words);
		cards.chars.textContent = String(stats.characters);
		cards.paragraphs.textContent = String(stats.paragraphs);
		cards.readTime.textContent = stats.readingTime;
	});

	// Update outline
	store.on("outline", (items: OutlineItem[]) => {
		renderOutline(outlineList, items);
	});
}

function createStatCards(grid: HTMLElement, LL: ReturnType<typeof getLL>) {
	const make = (label: string) => {
		const card = document.createElement("div");
		card.className = styles.statCard;
		const value = document.createElement("div");
		value.className = styles.statValue;
		value.textContent = "0";
		const lbl = document.createElement("div");
		lbl.className = styles.statLabel;
		lbl.textContent = label;
		card.appendChild(value);
		card.appendChild(lbl);
		grid.appendChild(card);
		return value;
	};

	return {
		words: make(LL.words()),
		chars: make(LL.characters()),
		paragraphs: make(LL.paragraphs()),
		readTime: make(LL.readingTimeLabel()),
	};
}

function renderOutline(list: HTMLElement, items: OutlineItem[]) {
	list.textContent = "";
	for (const item of items) {
		const li = document.createElement("li");
		li.className =
			item.level > 1 ? styles.outlineItemIndent : styles.outlineItem;
		li.textContent = item.text;
		li.addEventListener("click", () => {
			bus.emit("editor:scroll-to", item);
		});
		list.appendChild(li);
	}
}
