import fs from "node:fs";
import path from "node:path";

import { DOC_DIRS, DOCS_ROOT, LOCALES } from "./config.js";
import { contentHash, listMarkdownFiles, parseFrontmatter } from "./utils.js";

interface CheckResult {
  missing: string[];
  stubs: string[];
  outdated: string[];
}

function check(): CheckResult {
  const result: CheckResult = {
    missing: [],
    stubs: [],
    outdated: [],
  };

  for (const dir of DOC_DIRS) {
    const sourceDir = path.join(DOCS_ROOT, dir);
    const files = listMarkdownFiles(sourceDir);

    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file);
      const srcHash = contentHash(sourceFilePath);

      for (const locale of LOCALES) {
        const localeFilePath = path.join(DOCS_ROOT, locale, dir, file);
        const label = `${locale}/${dir}/${file}`;

        if (!fs.existsSync(localeFilePath)) {
          result.missing.push(label);
          continue;
        }

        const content = fs.readFileSync(localeFilePath, "utf-8");
        const fm = parseFrontmatter(content);

        if (fm.translated === false) {
          result.stubs.push(label);
        } else if (fm.sourceHash && String(fm.sourceHash) !== srcHash) {
          result.outdated.push(label);
        }
      }
    }
  }

  return result;
}

function printResult(result: CheckResult): void {
  console.log("\n🔍 i18n Check Report");
  console.log("──────────────────────────────");

  if (result.missing.length > 0) {
    console.log(`\n❌ Missing (${result.missing.length}):`);
    for (const f of result.missing) {
      console.log(`  - ${f}`);
    }
  }

  if (result.stubs.length > 0) {
    console.log(`\n📝 Stubs - needs translation (${result.stubs.length}):`);
    for (const f of result.stubs) {
      console.log(`  - ${f}`);
    }
  }

  if (result.outdated.length > 0) {
    console.log(`\n⚠️  Outdated (${result.outdated.length}):`);
    for (const f of result.outdated) {
      console.log(`  - ${f}`);
    }
  }

  if (
    result.missing.length === 0 &&
    result.stubs.length === 0 &&
    result.outdated.length === 0
  ) {
    console.log("\n✅ All translations are complete and up-to-date.");
  }
}

// Write JSON report for CI consumption
function writeJsonReport(result: CheckResult): void {
  const reportPath = path.resolve(
    import.meta.dirname,
    "../../i18n-report.json",
  );
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2) + "\n", "utf-8");
}

// CLI entry point
const result = check();
printResult(result);
writeJsonReport(result);

// Exit with code 1 if there are completely missing files (no stub)
if (result.missing.length > 0) {
  console.log(
    "\n💡 Run `make i18n-sync` to generate stub files for missing translations.",
  );
  process.exit(1);
}
