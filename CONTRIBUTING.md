# Contributing to FxTS

First off, thank you for considering contributing to FxTS! It's people like you that make FxTS such a great tool for functional programming in TypeScript.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, test cases)
- **Describe the expected behavior**
- **Include your environment details** (Node.js version, OS, etc.)

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description** of the proposed feature
- **Explain why this feature would be useful** to FxTS users
- **Include code examples** if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing code style
5. Write a clear commit message describing your changes

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FxTS.git
   cd FxTS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

### Available Scripts

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm run build`         | Build the project                 |
| `npm test`              | Run the test suite                |
| `npm run lint`          | Check for linting errors          |
| `npm run lint:fix`      | Fix linting errors automatically  |
| `npm run prettier`      | Check code formatting             |
| `npm run prettier:fix`  | Fix code formatting automatically |
| `npm run compile:check` | Run TypeScript type checking      |

### Before Submitting

Make sure your changes pass all checks:

```bash
npm run lint
npm run prettier
npm run compile:check
npm test
```

## Code Style Guidelines

### TypeScript

- Write clean, readable TypeScript code
- Use proper type annotations
- Prefer `type` imports for type-only imports (enforced by ESLint)

### Functional Programming Principles

FxTS is a functional programming library. Please keep these principles in mind:

- **Immutability**: Avoid mutating data
- **Pure Functions**: Functions should not have side effects
- **Lazy Evaluation**: Support lazy evaluation where applicable
- **Type Safety**: Ensure proper type inference

### Formatting

This project uses ESLint and Prettier for code style. Your code will be automatically checked against these rules.

## Testing

- We use Jest for testing
- Test files should be named `*.spec.ts`
- Place tests in the same directory as the code being tested
- New features must include comprehensive tests
- Bug fixes should include a test that would have caught the bug

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm test -- --watch
```

## Submitting Changes

1. **Create an issue first** (if one doesn't exist) to discuss your proposed changes
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** with clear, descriptive commits
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch
   - Reference any related issues in your PR description (e.g., "Fixes #123")
   - Describe what changes you made and why

## Project Structure

```
FxTS/
├── src/           # Source code
├── test/          # Test files
├── docs/          # Documentation
└── website/       # Documentation website
```

## License

By contributing to FxTS, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).

## Questions?

Feel free to open an issue if you have any questions about contributing!
