import fs from "node:fs";
import path from "node:path";

import { DOC_DIRS, DOCS_ROOT, LOCALES, STATUS_FILE } from "./config.js";
import {
  contentHash,
  createStub,
  listMarkdownFiles,
  parseFrontmatter,
} from "./utils.js";

interface TranslationEntry {
  status: "missing" | "stub" | "translated" | "outdated";
  hash?: string;
}

interface FileEntry {
  sourceHash: string;
  translations: Record<string, TranslationEntry>;
}

interface StatusFile {
  version: number;
  generatedAt: string;
  locales: string[];
  files: Record<string, FileEntry>;
}

interface SyncReport {
  createdStubs: string[];
  markedOutdated: string[];
  removedOrphans: string[];
}

function loadStatus(): StatusFile {
  if (fs.existsSync(STATUS_FILE)) {
    return JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
  }
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    locales: [...LOCALES],
    files: {},
  };
}

function saveStatus(status: StatusFile): void {
  status.generatedAt = new Date().toISOString();
  // Sort keys alphabetically
  const sorted: StatusFile = {
    ...status,
    files: Object.fromEntries(
      Object.entries(status.files).sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
  fs.writeFileSync(
    STATUS_FILE,
    JSON.stringify(sorted, null, 2) + "\n",
    "utf-8",
  );
}

function getTranslationStatus(
  filePath: string,
  sourceHash: string,
): TranslationEntry {
  if (!fs.existsSync(filePath)) {
    return { status: "missing" };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const fm = parseFrontmatter(content);

  if (fm.translated === false) {
    return { status: "stub", hash: String(fm.sourceHash || "") };
  }

  // Treat as translated: either `translated: true` or no marker (legacy files)
  // Check if source has changed by comparing sourceHash in frontmatter
  if (fm.sourceHash) {
    if (String(fm.sourceHash) !== sourceHash) {
      return { status: "outdated", hash: String(fm.sourceHash) };
    }
  }

  return { status: "translated", hash: sourceHash };
}

export function sync(dryRun = false): SyncReport {
  const report: SyncReport = {
    createdStubs: [],
    markedOutdated: [],
    removedOrphans: [],
  };

  const status = loadStatus();

  // Collect current English source files
  const sourceFiles = new Set<string>();

  for (const dir of DOC_DIRS) {
    const sourceDir = path.join(DOCS_ROOT, dir);
    const files = listMarkdownFiles(sourceDir);

    for (const file of files) {
      const relPath = `${dir}/${file}`;
      sourceFiles.add(relPath);

      const sourceFilePath = path.join(sourceDir, file);
      const srcHash = contentHash(sourceFilePath);

      // Initialize status entry
      if (!status.files[relPath]) {
        status.files[relPath] = {
          sourceHash: srcHash,
          translations: {},
        };
      } else {
        status.files[relPath].sourceHash = srcHash;
      }

      for (const locale of LOCALES) {
        const localeFilePath = path.join(DOCS_ROOT, locale, dir, file);
        const entry = getTranslationStatus(localeFilePath, srcHash);

        if (entry.status === "missing") {
          // Create stub file
          if (!dryRun) {
            createStub(sourceFilePath, localeFilePath, srcHash);
            entry.status = "stub";
            entry.hash = srcHash;
          }
          report.createdStubs.push(`${locale}/${relPath}`);
        } else if (entry.status === "outdated") {
          report.markedOutdated.push(`${locale}/${relPath}`);
        }

        status.files[relPath].translations[locale] = entry;
      }
    }
  }

  // Detect orphans: files that exist in locale but not in English source
  for (const locale of LOCALES) {
    for (const dir of DOC_DIRS) {
      const localeDir = path.join(DOCS_ROOT, locale, dir);
      const localeFiles = listMarkdownFiles(localeDir);

      for (const file of localeFiles) {
        const relPath = `${dir}/${file}`;
        if (!sourceFiles.has(relPath)) {
          const orphanPath = path.join(localeDir, file);
          if (!dryRun) {
            fs.unlinkSync(orphanPath);
          }
          report.removedOrphans.push(`${locale}/${relPath}`);
        }
      }
    }
  }

  // Clean up orphan entries from status
  for (const relPath of Object.keys(status.files)) {
    if (!sourceFiles.has(relPath)) {
      delete status.files[relPath];
    }
  }

  if (!dryRun) {
    saveStatus(status);
  }

  return report;
}

function printReport(report: SyncReport): void {
  console.log("\n📊 i18n Sync Report");
  console.log("──────────────────────────────");

  if (report.createdStubs.length > 0) {
    console.log("\nCreated stubs:");
    for (const f of report.createdStubs) {
      console.log(`  - ${f}`);
    }
  }

  if (report.markedOutdated.length > 0) {
    console.log("\nMarked outdated:");
    for (const f of report.markedOutdated) {
      console.log(`  - ${f}`);
    }
  }

  if (report.removedOrphans.length > 0) {
    console.log("\nRemoved orphans:");
    for (const f of report.removedOrphans) {
      console.log(`  - ${f}`);
    }
  }

  if (
    report.createdStubs.length === 0 &&
    report.markedOutdated.length === 0 &&
    report.removedOrphans.length === 0
  ) {
    console.log("\n✅ All translations are in sync.");
  }

  console.log("\nUpdated translation-status.json");
}

// CLI entry point
const report = sync();
printReport(report);
