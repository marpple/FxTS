import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Computes a truncated SHA-256 hash of the file body (excluding frontmatter).
 */
export function contentHash(filePath: string): string {
  const content = fs.readFileSync(filePath, "utf-8");
  const body = stripFrontmatter(content);
  return createHash("sha256").update(body).digest("hex").slice(0, 16);
}

/**
 * Strips YAML frontmatter (--- ... ---) and returns the body.
 */
export function stripFrontmatter(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n/);
  if (match) {
    return content.slice(match[0].length);
  }
  return content;
}

/**
 * Parses YAML frontmatter into a key-value object.
 */
export function parseFrontmatter(
  content: string,
): Record<string, string | boolean> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const result: Record<string, string | boolean> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: string | boolean = line.slice(colonIdx + 1).trim();
    // Remove quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (value === "true") value = true;
    if (value === "false") value = false;
    result[key] = value;
  }
  return result;
}

/**
 * Lists all .md files in a directory (non-recursive).
 */
export function listMarkdownFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

/**
 * Creates a stub file by copying English source with a `translated: false` marker.
 */
export function createStub(
  sourceFilePath: string,
  targetFilePath: string,
  sourceHash: string,
): void {
  const content = fs.readFileSync(sourceFilePath, "utf-8");
  const fm = parseFrontmatter(content);
  const body = stripFrontmatter(content);

  // Reconstruct frontmatter
  const fmLines = ["---"];
  if (fm.id) fmLines.push(`id: ${fm.id}`);
  if (fm.description) fmLines.push(`description: "${fm.description}"`);
  fmLines.push("translated: false");
  fmLines.push(`sourceHash: "${sourceHash}"`);
  fmLines.push("---");

  const stubContent = fmLines.join("\n") + "\n" + body;

  // Create directory if it doesn't exist
  const dir = path.dirname(targetFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(targetFilePath, stubContent, "utf-8");
}
