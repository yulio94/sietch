use serde::{Deserialize, Serialize};

/// Project metadata serialized in `sietch.json`.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectMeta {
    pub name: String,
    pub author: String,
    pub created: String,
    pub modified: String,
    pub version: String,
    pub chapter_order: Vec<String>,
}

impl ProjectMeta {
    /// Creates a new project with default values.
    pub fn new(name: &str) -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            name: name.to_string(),
            author: String::new(),
            created: now.clone(),
            modified: now,
            version: "1.0.0".to_string(),
            chapter_order: Vec::new(),
        }
    }
}
