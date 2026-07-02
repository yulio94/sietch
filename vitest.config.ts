import { defineConfig } from "vitest/config";

export default defineConfig({
	css: { modules: { localsConvention: "camelCaseOnly" } },
	test: { environment: "happy-dom" },
});
