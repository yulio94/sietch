import { bus } from "../../core/bus";
import { store } from "../../core/store";
import { getLL } from "../../i18n";
import type { Doc } from "../../types";
import styles from "./sidebar.module.css";

export function createSidebar(container: HTMLElement) {
	const LL = getLL();

	// Render
	container.innerHTML = `
    <div class="${styles.sidebar}">
      <div class="${styles.header}">
        <h2 class="${styles.headerTitle}">${LL.library()}</h2>
        <button class="${styles.btnNew}" id="btn-new">${LL.newDocument()}</button>
      </div>
      <div class="${styles.projectTitle}">${LL.projectTitle()}</div>
      <div class="${styles.docList}" id="doc-list"></div>
    </div>
  `;

	// New document button
	container.querySelector("#btn-new")?.addEventListener("click", () => {
		bus.emit("document:new");
	});

	// Reactive render on documents change
	store.on("documents", (docs: Doc[]) => renderDocs(docs));
	store.on("activeDoc", () => renderDocs(store.get("documents") ?? []));

	function renderDocs(docs: Doc[]) {
		const list = container.querySelector("#doc-list");
		if (!list) return;
		const activeId = store.get("activeDoc")?.id;

		list.innerHTML = docs
			.map(
				(doc) => `
        <div class="${doc.id === activeId ? styles.docItemActive : styles.docItem}"
             data-id="${doc.id}">
          <div class="${styles.docTitle}">${doc.title}</div>
          <div class="${styles.docPreview}">${doc.preview}</div>
          <div class="${styles.docMeta}">${doc.meta}</div>
        </div>
      `,
			)
			.join("");

		// Click handlers
		list
			.querySelectorAll(`.${styles.docItem}, .${styles.docItemActive}`)
			.forEach((el) => {
				el.addEventListener("click", () => {
					const id = (el as HTMLElement).dataset.id;
					const doc = docs.find((d) => d.id === id);
					if (doc) {
						store.set("activeDoc", doc);
						bus.emit("document:load", doc);
					}
				});
			});
	}
}
