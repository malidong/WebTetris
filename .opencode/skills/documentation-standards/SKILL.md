---
name: documentation-standards
description: |-
  Documentation standards for code, APIs, and architecture. Use when writing README files, JSDoc comments, API documentation, or architecture decision records. Use proactively when creating new modules or functions. Examples:
  - user: "document this function" → apply JSDoc format
  - user: "write a README for this project" → follow README template
  - user: "record this architecture decision" → use ADR format
license: MIT
metadata:
  version: "1.0"
  applies-to: architect, designer, code-implementer
---

# Documentation Standards

## JSDoc Function Comments

Every exported function must have a JSDoc comment:

```typescript
/**
 * Authenticates a user and returns a signed JWT token.
 *
 * @param email - The user's email address (RFC 5322 format)
 * @param password - The user's plain-text password (min 12 chars)
 * @param context - Request context including IP for rate limiting
 * @returns Promise resolving to a signed JWT access token
 *
 * @throws {ValidationError} If email or password format is invalid
 * @throws {AuthError} If credentials do not match
 * @throws {RateLimitError} If too many failed attempts from this IP
 *
 * @example
 * const token = await loginUser('user@example.com', 'SecurePass123!', ctx)
 * // Returns: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *
 * @security Requires rate limiting middleware. Passwords must be
 *           hashed with bcrypt before storage.
 */
async function loginUser(
  email: string,
  password: string,
  context: RequestContext
): Promise<string>
```

## README Template

```markdown
# Project Name

Brief one-sentence description of what this project does.

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
\`\`\`

## Requirements

- Node.js 20+
- Docker (for containerized deployment)

## Development

### Project Structure
\`\`\`
src/
├── types/       # Shared TypeScript types
├── utils/       # Utility functions
└── [modules]/   # Feature modules
\`\`\`

### Available Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run test suite |
| `npm run lint` | Run linter |

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No (default: 3000) | Server port |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |

## Deployment

\`\`\`bash
docker compose up -d --build
\`\`\`

## License

MIT
```

## Architecture Decision Record (ADR)

Use ADR format for significant architecture decisions:

```markdown
# ADR-001: Use TypeScript with HTML5 Canvas for Tetris

**Date**: 2026-04-28
**Status**: Accepted
**Deciders**: architect agent

## Context

We need to implement a Tetris game that runs in the browser without
requiring a server for gameplay logic.

## Decision

Use TypeScript compiled to JavaScript with HTML5 Canvas API for rendering.
No external game frameworks.

## Rationale

- TypeScript provides type safety for game state management
- Canvas API gives direct pixel control needed for game rendering
- No framework dependency reduces bundle size and complexity
- Single HTML file deployment simplifies Docker containerization

## Consequences

**Positive**:
- Small bundle size (<50KB)
- No framework learning curve
- Easily portable to any static hosting

**Negative**:
- Manual canvas management (no built-in scene graph)
- More boilerplate for animation loop

## Alternatives Considered

- Phaser.js: rejected (too heavy for simple Tetris, ~1MB)
- React + CSS: rejected (DOM manipulation too slow for 60fps game loop)
```

Store ADRs in `docs/decisions/` directory.

## Inline Comment Guidelines

```typescript
// ✅ Good: Explains WHY, not WHAT
// Use modulo to wrap piece position within board bounds,
// preventing infinite rotation accumulation
piece.rotation = (piece.rotation + 1) % 4

// ❌ Bad: Explains WHAT (already obvious from code)
// Increment rotation by 1 and modulo by 4
piece.rotation = (piece.rotation + 1) % 4

// ✅ Good: Flags non-obvious behavior
// WARNING: Canvas y-axis is inverted (0 = top, increases downward)
const screenY = board.height - piece.y

// ✅ Good: Documents a known limitation
// TODO: This is O(n²) — acceptable for board size ≤ 20x10,
// but will need optimization if board size increases
for (const row of board) {
  for (const cell of row) { ... }
}
```
