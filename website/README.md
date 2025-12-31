# FxTS Documentation (VitePress)

Official documentation site for FxTS, built with [VitePress](https://vitepress.dev/).

## Project Structure

```
website/
├── docs/                    # Documentation source files
│   ├── .vitepress/          # VitePress config and theme
│   ├── api/                 # Auto-generated API docs (do not edit manually)
│   ├── guide/               # Guide articles
│   └── public/              # Static assets (images, favicon)
└── generate-api-docs/       # API documentation generator
    ├── markdown-plugin/     # Custom api-documenter plugin
    ├── scripts/             # Build scripts
    └── function.json        # Function categories for sidebar
```

**Note**: Files in `docs/api/` are auto-generated. Edit source code TSDoc comments instead.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
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
