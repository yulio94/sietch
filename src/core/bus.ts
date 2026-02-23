import type { BusEvents } from "../types";

type Handler<T> = T extends undefined ? () => void : (data: T) => void;

class EventBus {
	private handlers = new Map<string, Set<Handler<unknown>>>();

	on<K extends keyof BusEvents>(
		event: K,
		handler: Handler<BusEvents[K]>,
	): () => void {
		if (!this.handlers.has(event)) {
			this.handlers.set(event, new Set());
		}
		const set = this.handlers.get(event);
		if (!set) return () => {};
		set.add(handler as Handler<unknown>);
		return () => set.delete(handler as Handler<unknown>);
	}

	emit<K extends keyof BusEvents>(
		...args: BusEvents[K] extends undefined ? [K] : [K, BusEvents[K]]
	): void {
		const [event, data] = args;
		const set = this.handlers.get(event);
		if (set) {
			for (const handler of set) {
				(handler as (data?: unknown) => void)(data);
			}
		}
	}
}

export const bus = new EventBus();
