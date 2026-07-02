use crate::db::init::initialize_db;
use crate::models::project::ProjectMeta;
use std::fs;
use std::path::PathBuf;

/// Creates a new project at `{path}/{name}/`.
/// Generates the directory structure, `sietch.json`, and the SQLite database.
#[tauri::command]
pub fn create_project(name: String, path: String) -> Result<ProjectMeta, String> {
    let project_dir = PathBuf::from(&path).join(&name);

    // Create project directories
    for sub in &["chapters", "notes", "trash", ".sietch"] {
        fs::create_dir_all(project_dir.join(sub))
            .map_err(|e| format!("Failed to create directory {sub}: {e}"))?;
    }

    // Create metadata
    let meta = ProjectMeta::new(&name);
    let json = serde_json::to_string_pretty(&meta)
        .map_err(|e| format!("Failed to serialize metadata: {e}"))?;
    fs::write(project_dir.join("sietch.json"), json)
        .map_err(|e| format!("Failed to write sietch.json: {e}"))?;

    // Initialize database
    let _conn = initialize_db(&project_dir)?;

    Ok(meta)
}

/// Opens an existing project by reading `sietch.json`.
/// Recreates missing directories and cleans `chapter_order` for orphaned IDs.
#[tauri::command]
pub fn open_project(path: String) -> Result<ProjectMeta, String> {
    let project_dir = PathBuf::from(&path);
    let meta_path = project_dir.join("sietch.json");

    // Verify sietch.json exists
    if !meta_path.exists() {
        return Err("sietch.json not found — this folder is not a Sietch project.".into());
    }

    // Read and parse metadata
    let raw =
        fs::read_to_string(&meta_path).map_err(|e| format!("Failed to read sietch.json: {e}"))?;
    let mut meta: ProjectMeta =
        serde_json::from_str(&raw).map_err(|e| format!("Failed to parse sietch.json: {e}"))?;

    // Recreate missing directories (tolerant validation)
    for sub in &["chapters", "notes", "trash", ".sietch"] {
        let dir = project_dir.join(sub);
        if !dir.exists() {
            fs::create_dir_all(&dir)
                .map_err(|e| format!("Failed to recreate directory {sub}: {e}"))?;
        }
    }

    // Initialize database (idempotent — safe to call on every open)
    let _conn = initialize_db(&project_dir)?;

    // Clean chapter_order: only keep IDs whose .md file exists in chapters/
    let chapters_dir = project_dir.join("chapters");
    meta.chapter_order
        .retain(|id| chapters_dir.join(format!("{id}.md")).exists());

    Ok(meta)
}
