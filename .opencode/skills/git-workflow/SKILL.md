---
name: git-workflow
description: |-
  Git workflow standards including commit message format, branching strategy, and PR conventions. Use when creating commits, writing commit messages, creating branches, or setting up repository structure. Use proactively when starting a new project or feature. Examples:
  - user: "commit these changes" → apply conventional commits format
  - user: "create a branch for this feature" → follow branching naming convention
  - user: "set up the repo" → initialize with proper structure
license: MIT
metadata:
  version: "1.0"
  applies-to: agent-executor, code-implementer
---

# Git Workflow Standards

## Commit Message Format (Conventional Commits)

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types
| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons (no logic change) |
| `perf` | Performance improvements |
| `chore` | Build process, dependency updates |
| `ci` | CI/CD configuration |
| `security` | Security fixes |

### Examples

```
feat(auth): add JWT token refresh endpoint

Adds a /auth/refresh endpoint that accepts a valid refresh token
and returns a new access token with 15 minute expiry.

Closes #42

---

fix(game): correct collision detection at board edges

Off-by-one error caused pieces to clip through the right wall.
Changed boundary check from < to <= in isValidPosition().

---

test(auth): add unit tests for loginUser edge cases

Covers: null input, SQL injection strings, expired tokens,
rate limit enforcement.
```

## Branching Strategy

```
main          ← production-ready, protected
  └── develop ← integration branch
        ├── feature/short-description
        ├── fix/short-description
        └── refactor/short-description
```

### Branch Naming
```
feature/user-authentication
feature/tetris-collision-detection
fix/login-rate-limit-bypass
fix/piece-rotation-off-by-one
refactor/extract-game-loop
security/patch-sql-injection
```

## Repository Structure

```
project-root/
├── src/                  # Source code
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Shared utilities
│   └── [modules]/        # Feature modules
├── tests/                # Test files mirror src/ structure
│   ├── unit/
│   └── integration/
├── docs/                 # Documentation
├── .github/
│   └── workflows/        # CI/CD pipelines
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## .gitignore (Base Template)

```
# Dependencies
node_modules/

# Build output
dist/
build/
.next/

# Environment files
.env
.env.local
.env.production

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp

# Test coverage
coverage/
.nyc_output/

# Docker
.docker/
```

## Initial Repository Setup

```bash
git init
git add .
git commit -m "chore: initial project setup"
git branch -M main
git remote add origin <url>
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop
```

## Before Every Commit Checklist

- [ ] All tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] No console.log left in production code
- [ ] No hardcoded secrets or credentials
- [ ] Commit message follows conventional format
- [ ] Changes are atomic (one logical change per commit)
