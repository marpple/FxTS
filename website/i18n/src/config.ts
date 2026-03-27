import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DOCS_ROOT = path.resolve(__dirname, "../../docs");

export const LOCALES = ["ja", "ko", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DOC_DIRS = ["api", "guide"] as const;

export const STATUS_FILE = path.resolve(
  __dirname,
  "../../translation-status.json",
);
