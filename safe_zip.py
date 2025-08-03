import os
import zipfile

# Directories and files you always want to include (safe defaults)
INCLUDE_DIRS = ["assets", "components", "lib", "navigation", "screens"]
INCLUDE_FILES = ["App.js", "app.json", "babel.config.js", "index.js", "package.json", "package-lock.json"]


# Fallback exclusions if no .gitignore found
DEFAULT_EXCLUDE_PATTERNS = [
    "node_modules",
    ".git",
    ".env",
    ".DS_Store",
    "__pycache__",
]

def load_gitignore_patterns():
    """Load ignore patterns from .gitignore if it exists."""
    patterns = []
    if os.path.exists(".gitignore"):
        with open(".gitignore", "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    patterns.append(line)
    return patterns if patterns else DEFAULT_EXCLUDE_PATTERNS

def should_exclude(path, patterns):
    """Return True if path matches any exclude pattern."""
    for pattern in patterns:
        if pattern in path:
            return True
    return False

def zip_project(output_zip="chester_clean.zip"):
    exclude_patterns = load_gitignore_patterns()

    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Add directories
        for include_dir in INCLUDE_DIRS:
            if os.path.exists(include_dir):
                for root, dirs, files in os.walk(include_dir):
                    if should_exclude(root, exclude_patterns):
                        continue
                    for file in files:
                        filepath = os.path.join(root, file)
                        if should_exclude(filepath, exclude_patterns):
                            continue
                        zipf.write(filepath)

        # Add individual files
        for file in INCLUDE_FILES:
            if os.path.exists(file) and not should_exclude(file, exclude_patterns):
                zipf.write(file)

    print(f"Created safe zip: {output_zip}")

if __name__ == "__main__":
    zip_project()
