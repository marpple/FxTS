# FxTS i18n Tooling

Translation synchronization system for the FxTS documentation website. Ensures that all supported locales stay in sync with the English source docs by detecting missing, outdated, and orphaned translation files.

## Quick Start

```bash
# From website/generate-api-docs/
make i18n-sync    # Generate stubs, remove orphans, update status
make i18n-check   # Dry-run validation (used in CI)
```

## How It Works

### Source of Truth

English documentation files under `docs/api/` and `docs/guide/` are the source of truth. When a new API function is added via `make all`, only English docs are auto-generated. The i18n tooling bridges the gap by ensuring every locale directory mirrors the English file set.

### Translation Lifecycle

Each translation file goes through these states:

```
missing ──► stub ──► translated
                         │
                         ▼
                      outdated  (when English source changes)
```

| State        | Meaning                                                | CI Behavior                  |
| ------------ | ------------------------------------------------------ | ---------------------------- |
| `missing`    | No file exists in the locale directory                 | **Blocks PR** (exit code 1)  |
| `stub`       | English content copied with `translated: false` marker | Passes CI, tracked via Issue |
| `translated` | Fully translated (no marker or `translated: true`)     | Passes CI                    |
| `outdated`   | Translated, but English source hash has changed        | Passes CI, tracked via Issue |

### Content Hashing

The system uses **SHA-256 content hashing** to detect when English source documents change after translations have been completed.

**How it works:**

1. For each English source file, a hash is computed from the **body content only** (YAML frontmatter is stripped before hashing). This means metadata-only changes (e.g., updating `description`) do not trigger false outdated alerts.

2. The hash is truncated to the first 16 hex characters (64 bits) for readability while maintaining collision resistance sufficient for this use case.

3. When a stub is created, the current source hash is embedded in the frontmatter:

   ```yaml
   ---
   id: throttle
   translated: false
   sourceHash: "3dee719216b52c51"
   ---
   ```

4. On subsequent syncs, the system compares the stored `sourceHash` against the current English file's hash. A mismatch means the source changed and the translation needs updating.

### Stub Generation

When `sync.ts` detects a missing locale file, it creates a stub by:

1. Reading the English source file
2. Parsing its frontmatter to preserve `id` and `description`
3. Injecting `translated: false` and `sourceHash` into the frontmatter
4. Copying the English body content as-is

This ensures every locale directory always has a complete set of files, so VitePress can render all pages (showing English content with a warning banner for untranslated ones).

### Orphan Detection

If an English source file is deleted (e.g., a deprecated function is removed), the corresponding locale files become orphans. `sync.ts` detects these by comparing the locale file set against the English file set and removes them automatically.

## Scripts

### `sync.ts`

The main synchronization engine. Run via `make i18n-sync` or `npm run sync`.

**Operations performed (in order):**

1. Scan `docs/api/*.md` and `docs/guide/*.md` to build the English file set
2. For each locale (`ja`, `ko`, `zh`):
   - **Missing files**: Create stub with English content + `translated: false` marker
   - **Existing files**: Check translation status via frontmatter and content hash
3. **Orphan cleanup**: Delete locale files that have no corresponding English source
4. Write `translation-status.json` with the complete status of all files

**Output artifacts:**

- Stub `.md` files in locale directories
- `website/translation-status.json` (central status tracking)

### `check.ts`

CI-friendly validation script. Run via `make i18n-check` or `npm run check`.

**Behavior:**

- Scans all locales and categorizes files as `missing`, `stub`, or `outdated`
- Writes `website/i18n-report.json` for CI comment generation
- Exits with code **1** only when `missing` files exist (no stub at all)
- Exits with code **0** for `stub` and `outdated` (these are tracked via Issues, not blocking)

### `create-issues.ts`

GitHub Issue automation. Run via `npm run create-issues` (typically in CI after PR merge).

**Behavior:**

- Reads `translation-status.json` for `stub` and `outdated` entries
- Creates one GitHub Issue per locale per file (e.g., "Translate `throttle.md` to Japanese")
- Applies labels: `translation`, `good first issue`, `lang:{locale}`
- Deduplicates by checking for existing open issues with the same title
- Auto-creates labels if they don't exist in the repository

## Configuration

All configuration lives in `src/config.ts`:

```typescript
export const LOCALES = ["ja", "ko", "zh"] as const; // Supported locales
export const DOC_DIRS = ["api", "guide"] as const; // Doc directories to track
```

To add a new locale, add it to the `LOCALES` array. No other changes are needed — the sync script will automatically create stubs for all existing docs in the new locale.

## File Structure

```
website/i18n/
├── package.json          # Dependencies (tsx, typescript)
├── tsconfig.json
├── src/
│   ├── config.ts         # Locales, paths, constants
│   ├── utils.ts          # Hashing, frontmatter parsing, stub creation
│   ├── sync.ts           # Main sync engine
│   ├── check.ts          # CI validation (dry-run)
│   └── create-issues.ts  # GitHub Issue automation
│
website/
├── translation-status.json   # Central status file (generated)
├── i18n-report.json          # CI check report (generated)
└── docs/
    ├── api/                  # English source (source of truth)
    ├── guide/                # English guides
    ├── ja/{api,guide}/       # Japanese translations
    ├── ko/{api,guide}/       # Korean translations
    └── zh/{api,guide}/       # Chinese translations
```

## CI Integration

Two GitHub Actions workflows consume these scripts:

### `i18n-check.yml` (on every PR)

1. Runs `npm run check`
2. If missing files detected: posts a bot comment on the PR with a table of missing translations and instructions to run `make i18n-sync`
3. Fails the check to block the PR

### `i18n-issues.yml` (on PR merge)

1. Runs `npm run create-issues`
2. Creates per-language GitHub Issues for any `stub` or `outdated` translations
3. Issues include contribution guides and are labeled for easy discovery

## Legacy File Handling

Existing translation files that predate this system (no `translated` or `sourceHash` in frontmatter) are treated as `translated` by default. Their status will be tracked correctly once the English source changes and they become `outdated`, at which point contributors can add the frontmatter markers during the update.
