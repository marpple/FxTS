import { execSync } from "node:child_process";
import fs from "node:fs";

import { LOCALES, STATUS_FILE } from "./config.js";

const LOCALE_LABELS: Record<string, string> = {
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
};

const REPO = getRepo();

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

function getRepo(): string {
  // Use GITHUB_REPOSITORY env var in CI, fallback to git remote
  if (process.env.GITHUB_REPOSITORY) {
    return process.env.GITHUB_REPOSITORY;
  }
  try {
    const remote = execSync("git remote get-url origin", {
      encoding: "utf-8",
    }).trim();
    const match = remote.match(/github\.com[:/](.+?)(?:\.git)?$/);
    return match?.[1] ?? "marpple/FxTS";
  } catch {
    return "marpple/FxTS";
  }
}

function ghCommand(args: string): string {
  return execSync(`gh ${args}`, { encoding: "utf-8" }).trim();
}

function issueExists(title: string): boolean {
  try {
    const result = ghCommand(
      `issue list --repo ${REPO} --search "${title}" --state open --json title --limit 100`,
    );
    const issues: Array<{ title: string }> = JSON.parse(result);
    return issues.some((i) => i.title === title);
  } catch {
    return false;
  }
}

function createIssue(
  locale: string,
  filePath: string,
  status: "stub" | "outdated",
): void {
  const langName = LOCALE_LABELS[locale] ?? locale;
  const fileName = filePath.split("/").pop() ?? filePath;
  const funcName = fileName.replace(".md", "");

  const isOutdated = status === "outdated";
  const action = isOutdated ? "Update" : "Translate";
  const title = `[Translation] ${action} \`${fileName}\` to ${langName}`;

  // Skip if an identical open issue already exists
  if (issueExists(title)) {
    console.log(`  ⏭️  Skipped (already exists): ${title}`);
    return;
  }

  const statusLabel = isOutdated
    ? "Outdated (English source has changed, translation needs update)"
    : "Stub (English content, needs translation)";

  const body = `## 📝 Translation ${isOutdated ? "Update " : ""}Needed

**File:** \`docs/${locale}/${filePath}\`
**Status:** ${statusLabel}
**English source:** [docs/${filePath}](https://github.com/${REPO}/blob/main/website/docs/${filePath})

## How to contribute

1. Fork this repository
2. Edit \`website/docs/${locale}/${filePath}\`
3. Translate the content from English to ${langName}
4. Update the frontmatter:
   - Change \`translated: false\` → \`translated: true\`
   - Keep \`sourceHash\` unchanged
5. Submit a Pull Request

## Translation guide

- Keep code examples unchanged
- Translate descriptions and explanations
- Maintain the same markdown structure
- See [existing ${langName} translations](https://github.com/${REPO}/tree/main/website/docs/${locale}) for reference

## Related

- English source: [${funcName}](https://fxts.dev/docs/${funcName})
- ${langName} page: [${funcName}](https://fxts.dev/${locale}/api/${funcName})
`;

  const labels = ["translation", "good first issue", `lang:${locale}`];
  const labelArgs = labels.map((l) => `--label "${l}"`).join(" ");

  try {
    ghCommand(
      `issue create --repo ${REPO} --title "${title}" --body "${body.replace(
        /"/g,
        '\\"',
      )}" ${labelArgs}`,
    );
    console.log(`  ✅ Created: ${title}`);
  } catch (e) {
    // If label doesn't exist, retry without labels
    try {
      ghCommand(
        `issue create --repo ${REPO} --title "${title}" --body "${body.replace(
          /"/g,
          '\\"',
        )}"`,
      );
      console.log(`  ✅ Created (without labels): ${title}`);
    } catch (e2) {
      console.error(`  ❌ Failed to create: ${title}`, e2);
    }
  }
}

function ensureLabelsExist(): void {
  const labels = [
    { name: "translation", color: "0e8a16", description: "Translation task" },
    ...LOCALES.map((l) => ({
      name: `lang:${l}`,
      color: "1d76db",
      description: `${LOCALE_LABELS[l]} translation`,
    })),
  ];

  for (const label of labels) {
    try {
      ghCommand(
        `label create "${label.name}" --repo ${REPO} --color "${label.color}" --description "${label.description}" --force`,
      );
    } catch {
      // Label may already exist, ignore errors
    }
  }
}

// CLI entry point
function main(): void {
  if (!fs.existsSync(STATUS_FILE)) {
    console.error(
      "translation-status.json not found. Run `make i18n-sync` first.",
    );
    process.exit(1);
  }

  const status: StatusFile = JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));

  // Collect files that need issues
  const toCreate: Array<{
    locale: string;
    file: string;
    status: "stub" | "outdated";
  }> = [];

  for (const [file, entry] of Object.entries(status.files)) {
    for (const [locale, translation] of Object.entries(entry.translations)) {
      if (translation.status === "stub" || translation.status === "outdated") {
        toCreate.push({ locale, file, status: translation.status });
      }
    }
  }

  if (toCreate.length === 0) {
    console.log("✅ No translation issues to create.");
    return;
  }

  console.log(`\n📋 Creating ${toCreate.length} translation issue(s)...\n`);

  ensureLabelsExist();

  for (const item of toCreate) {
    createIssue(item.locale, item.file, item.status);
  }

  console.log("\nDone.");
}

main();
