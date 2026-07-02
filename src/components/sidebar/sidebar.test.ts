import { expect, test } from "vitest";
import { store } from "../../core/store";
import { initI18n } from "../../i18n";
import type { Doc } from "../../types";
import { createSidebar } from "./sidebar";

// A malicious document title must render as text, never as live DOM.
test("doc title with <img onerror> is escaped, not executed", () => {
	initI18n("en");
	const container = document.createElement("div");
	createSidebar(container);

	const payload = '<img src=x onerror="alert(1)">';
	// renderDocs only reads id/title/preview/meta; cast the rest away.
	store.set("documents", [
		{ id: "1", title: payload, preview: "p", meta: "m" } as Doc,
	]);

	// If the fix regressed, innerHTML interpolation would create a real <img>.
	expect(container.querySelector("img")).toBeNull();
	// The payload survives as inert text.
	expect(container.textContent).toContain(payload);
});
