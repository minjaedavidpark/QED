# Linting Setup Documentation

This project uses comprehensive linting to maintain code quality and enforce commit message standards.

## Tools Used

### Code Quality

1. **ESLint** - JavaScript/TypeScript linting
2. **Prettier** - Code formatting
3. **TypeScript** - Type checking

### Git Hooks

1. **Husky** - Git hooks management
2. **lint-staged** - Run linters on staged files
3. **Commitlint** - Commit message validation

## Configuration Files

### ESLint (`.eslintrc.json`)

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "prettier/prettier": "warn",
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["warn", ...]
  }
}
```

### Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Commitlint (`.commitlintrc.json`)

Follows [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Lint-staged (`.lintstagedrc.json`)

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

## Available Commands

### Code Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Code Formatting

```bash
# Format all files
npm run format

# Check if files are formatted
npm run format:check
```

### Type Checking

```bash
# Run TypeScript type checker
npm run type-check
```

### Combined Check (Recommended before commits)

```bash
npm run lint:fix && npm run format && npm run type-check
```

## Git Hooks

### Pre-commit Hook

**Location:** `.husky/pre-commit`

Automatically runs before each commit:

- Lints and formats only **staged files**
- Fixes auto-fixable issues
- Fails commit if there are unfixable errors

**What it does:**

1. Runs ESLint with `--fix` on staged JS/TS files
2. Runs Prettier on staged files
3. Stages the fixed files

### Commit Message Hook

**Location:** `.husky/commit-msg`

Validates commit messages before they are saved.

**Valid commit formats:**

```bash
feat: add new feature
fix: resolve bug in API
docs: update README
style: format code
refactor: restructure components
perf: optimize rendering
test: add unit tests
build: update dependencies
ci: configure GitHub Actions
chore: update config files
```

**With scope (optional):**

```bash
feat(coach): add hint progression system
fix(api): handle null responses
docs(setup): add installation steps
```

**Invalid examples:**

```bash
# ❌ Missing type
Update the README

# ❌ Uppercase type
Feat: add feature

# ❌ Period at end
feat: add feature.

# ❌ Uppercase subject
feat: Add new feature
```

## Bypassing Hooks (Not Recommended)

If you absolutely need to bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip commit-msg hook
git commit --no-verify
```

**Warning:** Only use this in emergencies. It's better to fix the issues.

## Troubleshooting

### Hook Not Running

1. Ensure hooks are executable:

   ```bash
   chmod +x .husky/pre-commit .husky/commit-msg
   ```

2. Reinstall Husky:
   ```bash
   npm run prepare
   ```

### Linting Errors Won't Fix

1. Check the specific error message
2. Some errors require manual fixing
3. Run `npm run lint` to see all errors

### Prettier Conflicts

If Prettier and ESLint conflict:

1. Prettier should always win (configured via `eslint-config-prettier`)
2. Run `npm run format` to apply Prettier formatting
3. Then run `npm run lint:fix`

### Type Errors

TypeScript errors must be fixed manually:

```bash
npm run type-check
```

Review each error and fix the type issues.

## Best Practices

### Before Committing

1. Run linters: `npm run lint:fix`
2. Format code: `npm run format`
3. Type check: `npm run type-check`
4. Test locally: `npm run dev`

### During Development

- Let your IDE auto-format on save (configure for Prettier)
- Fix linting errors as you code
- Use TypeScript strictly (avoid `any` types)

### Writing Commit Messages

- Use present tense ("add" not "added")
- Be descriptive but concise
- Reference issue numbers when applicable
- Use scope for clarity in larger changes

## CI/CD Integration

These linting rules can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Lint
  run: npm run lint

- name: Format Check
  run: npm run format:check

- name: Type Check
  run: npm run type-check
```

## Editor Integration

### VS Code

Install extensions:

- ESLint
- Prettier - Code formatter

Settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Other Editors

- WebStorm: Built-in ESLint and Prettier support
- Sublime Text: Install ESLint and Prettier packages
- Vim: Use ALE or CoC plugins

## Summary

All linting tools work together to:

1. **Maintain consistency** - Code looks uniform
2. **Catch errors early** - Before they reach production
3. **Enforce standards** - Conventional commits, code style
4. **Improve quality** - TypeScript types, no unused vars
5. **Automate checks** - Via git hooks

This setup ensures high code quality and makes collaboration easier!
