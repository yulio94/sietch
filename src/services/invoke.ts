import { invoke } from "@tauri-apps/api/core";
import type { ProjectMeta } from "../types";

export function createProject(
	name: string,
	path: string,
): Promise<ProjectMeta> {
	return invoke<ProjectMeta>("create_project", { name, path });
}

export function openProject(path: string): Promise<ProjectMeta> {
	return invoke<ProjectMeta>("open_project", { path });
}
