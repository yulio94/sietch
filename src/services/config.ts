import { store } from "../core/store";
import type { Config, ConfigKeys } from "../types";

const DEFAULTS: Config = {
	theme: "light",
	sidebarOpen: true,
	inspectorOpen: true,
	focusMode: false,
	dailyGoal: 1000,
	locale: "en",
	sidebarWidth: 240,
	inspectorWidth: 260,
};

/** Keys from the reactive store that are auto-persisted on change. */
const STORE_KEYS: ConfigKeys[] = [
	"theme",
	"sidebarOpen",
	"inspectorOpen",
	"focusMode",
	"dailyGoal",
	"locale",
];

type LazyStore = {
	get<T>(key: string): Promise<T | undefined>;
	set(key: string, value: unknown): Promise<void>;
	save(): Promise<void>;
};

let lazyStore: LazyStore | null = null;

async function openStore(): Promise<LazyStore | null> {
	if (lazyStore) return lazyStore;
	try {
		const { LazyStore } = await import("@tauri-apps/plugin-store");
		lazyStore = new LazyStore("config.json");
		return lazyStore;
	} catch {
		// Not running in Tauri (browser-only dev) — persistence unavailable
		return null;
	}
}

/**
 * Load persisted config, push values into the reactive store,
 * and subscribe to future changes for auto-persist.
 */
export async function loadConfig(): Promise<Config> {
	const config = { ...DEFAULTS };
	const tauriStore = await openStore();

	if (tauriStore) {
		// Read persisted values, falling back to defaults for missing keys
		for (const key of STORE_KEYS) {
			const value = await tauriStore.get<(typeof config)[typeof key]>(key);
			if (value !== undefined) {
				(config as Record<string, unknown>)[key] = value;
			}
		}

		const sw = await tauriStore.get<number>("sidebarWidth");
		if (sw !== undefined) config.sidebarWidth = sw;

		const iw = await tauriStore.get<number>("inspectorWidth");
		if (iw !== undefined) config.inspectorWidth = iw;
	}

	// Push persisted values into the reactive store
	for (const key of STORE_KEYS) {
		store.set(key, config[key] as never);
	}

	// Subscribe to future store changes for auto-persist
	if (tauriStore) {
		for (const key of STORE_KEYS) {
			store.on(key, async (value) => {
				await tauriStore.set(key, value);
				await tauriStore.save();
			});
		}
	}

	return config;
}

/**
 * Persist panel widths — called by split-panels on drag end.
 */
export async function persistPanelWidths(
	sidebarWidth: number,
	inspectorWidth: number,
): Promise<void> {
	const tauriStore = await openStore();
	if (!tauriStore) return;
	await tauriStore.set("sidebarWidth", sidebarWidth);
	await tauriStore.set("inspectorWidth", inspectorWidth);
	await tauriStore.save();
}
