# Contributing to Reasoning Gym

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your API key
4. Run the development server: `npm run dev`

## Code Quality

We use several tools to maintain code quality:

### Linting

- **ESLint** - Enforces code quality and catches common errors
- **Prettier** - Ensures consistent code formatting
- **TypeScript** - Provides type safety

### Available Scripts

```bash
# Run ESLint
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix

# Format all code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check

# Type check TypeScript code
npm run type-check
```

### Git Hooks

We use **Husky** to run checks before commits and pushes:

#### Pre-commit Hook

Automatically runs before each commit:

- Lints and formats staged files using `lint-staged`
- Only processes files you're committing

#### Commit Message Hook

Validates commit messages follow conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `build:` - Build system changes
- `ci:` - CI/CD changes
- `chore:` - Other changes (dependencies, etc.)

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples:**

```bash
feat(coach): add hint progression system
fix(critique): resolve parsing error for JSON responses
docs(readme): update installation instructions
refactor(api): extract common API logic
```

**Rules:**

- Use lowercase for type
- Keep subject line under 100 characters
- Don't end subject with a period
- Use imperative mood ("add" not "added")
- Optionally include scope in parentheses

### Code Style Guidelines

#### TypeScript/React

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript types/interfaces (avoid `any`)
- Export interfaces for reusable types
- Use descriptive variable names

#### File Organization

- One component per file
- Group related files in directories
- Use index files for cleaner imports
- Keep API routes in `pages/api/`

#### Component Structure

```tsx
import React from 'react';

interface MyComponentProps {
  // Props interface first
}

export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Hooks at the top
  // Event handlers next
  // Return JSX
}
```

## Testing Your Changes

Before submitting a PR:

1. **Run linters:**

   ```bash
   npm run lint:fix
   npm run format
   ```

2. **Type check:**

   ```bash
   npm run type-check
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

4. **Test locally:**
   ```bash
   npm run dev
   # Test all features in the browser
   ```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass
4. Write a clear PR description
5. Request review

## Academic Integrity

Remember that Reasoning Gym is designed to help students learn, not to enable academic dishonesty:

- Features should guide thinking, not replace it
- Solutions should be earned through effort
- Include appropriate guardrails for academic integrity

## Questions?

If you have questions about contributing, please open an issue for discussion.
