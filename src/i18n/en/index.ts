import type { BaseTranslation } from "../i18n-types.js";

const en = {
	// Sidebar
	library: "Library",
	newDocument: "+",
	projectTitle: "Children of Dune",

	// Editor
	placeholder: "Begin writing...",
	untitled: "Untitled",
	justNow: "Just now",
	readingTime: "{minutes:number} min",

	// Inspector
	statistics: "Statistics",
	outline: "Outline",
	notes: "Notes",
	notesPlaceholder: "Jot down ideas, reminders...",
	words: "Words",
	characters: "Characters",
	paragraphs: "Paragraphs",
	readingTimeLabel: "Reading Time",

	// Statusbar
	wordCount: "{count:number} words",
	charCount: "{count:number} chars",
	readTimeStatus: "{time:string} read",
	goalProgress: "{current:string} / {goal:string}",

	// Command palette
	commandPlaceholder: "Type a command...",
	cmdNewDocument: "New Document",
	cmdToggleSidebar: "Toggle Sidebar",
	cmdToggleInspector: "Toggle Inspector",
	cmdToggleFocusMode: "Toggle Focus Mode",
	cmdToggleTheme: "Toggle Theme",
	catDocument: "Document",
	catView: "View",

	// Theme toggle
	toggleThemeLabel: "Toggle theme",
} satisfies BaseTranslation;

export default en;
