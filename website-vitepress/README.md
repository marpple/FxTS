# FxTS Documentation (VitePress)

## Setup

```bash
npm install
```

## Development

```bash
npm run docs:dev
```

## Build

```bash
npm run docs:build
```

## API Docs Generation

API docs are auto-generated from TypeScript source code using `@microsoft/api-extractor` and `@microsoft/api-documenter`.

```bash
cd generate-api-docs
make
```

Output: `docs/api/`

### Structure

```
generate-api-docs/
├── markdown-plugin/     # Custom api-documenter plugin
├── scripts/             # Build scripts
├── api-extractor.json   # Extracts API info from dist/types
├── api-documenter.json  # Configures markdown generation
└── function.json        # Function categories for index page
```

### Updating API Docs

1. Build FxTS first: `npm run build` (in root)
2. Run `make` in `generate-api-docs/`

### Adding New Functions

Edit `generate-api-docs/function.json` to categorize new functions.
