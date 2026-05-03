---
name: api-interface-standards
description: |-
  API and interface design standards including TypeScript signatures, REST conventions, error handling, and security annotations. Use when designing or reviewing API interfaces, function signatures, or module contracts. Use proactively during design and planning phases. Examples:
  - user: "design the user API" → apply REST conventions and security annotations
  - user: "create function signatures for auth module" → follow signature format
  - user: "review this interface" → check against design standards
license: MIT
metadata:
  version: "1.0"
  applies-to: designer, planner, security-reviewer
---

# API and Interface Design Standards

## Function Signature Format

Every function signature must include all relevant annotations:

```typescript
/**
 * @requires authenticated admin session (role: ADMIN)
 * @requires rate-limit: 10 requests per minute per IP
 * @validates email — RFC 5322 format, max 254 chars
 * @validates password — min 12 chars, must include uppercase, number, symbol
 * @throws ValidationError — if input fails validation
 * @throws ConflictError — if email already registered
 * @throws RateLimitError — if rate limit exceeded
 */
async function createUser(
  input: CreateUserInput,
  context: AuthContext
): Promise<User>
```

## Annotation Reference

| Annotation | Purpose | Example |
|------------|---------|---------|
| `@requires` | Preconditions caller must satisfy | `@requires authenticated session` |
| `@validates` | Input validation rules | `@validates email — RFC 5322 format` |
| `@throws` | Possible error types | `@throws ValidationError` |
| `@rate-limit` | Rate limiting rules | `@rate-limit 5 requests per 15 min` |
| `@idempotent` | Safe to retry | `@idempotent — duplicate calls return same result` |
| `@side-effects` | External state changes | `@side-effects sends welcome email` |

## REST API Conventions

### URL Structure
```
GET    /users              # List users
GET    /users/:id          # Get single user
POST   /users              # Create user
PUT    /users/:id          # Replace user (full update)
PATCH  /users/:id          # Update user (partial update)
DELETE /users/:id          # Delete user

# Nested resources
GET    /users/:id/posts    # List user's posts
POST   /users/:id/posts    # Create post for user
```

### HTTP Status Codes
```
200 OK              — Successful GET, PUT, PATCH
201 Created         — Successful POST
204 No Content      — Successful DELETE
400 Bad Request     — Validation error
401 Unauthorized    — Missing or invalid authentication
403 Forbidden       — Authenticated but not authorized
404 Not Found       — Resource does not exist
409 Conflict        — Duplicate resource
422 Unprocessable   — Valid format but semantic error
429 Too Many Requests — Rate limit exceeded
500 Internal Server Error — Unexpected server error
```

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string       // Machine-readable: "VALIDATION_ERROR"
    message: string    // Human-readable: "Email format is invalid"
    field?: string     // For validation errors: "email"
    details?: object   // Additional context
  }
}
```

## Input/Output Type Conventions

### Input Types
```typescript
// Use separate Input type for creation
interface CreateUserInput {
  email: string      // Always validate format
  password: string   // Never return in responses
  username: string
  role?: UserRole    // Optional with default
}

// Use Partial for updates
interface UpdateUserInput extends Partial<CreateUserInput> {
  // Only include fields that can be updated
}
```

### Response Types
```typescript
// Never expose sensitive fields in responses
interface User {
  id: string
  email: string
  username: string
  role: UserRole
  createdAt: Date
  // ❌ Never include: password, passwordHash, internalId
}
```

## Trust Boundary Definitions

Define trust boundaries between modules explicitly:

```
External (untrusted) → API Gateway → Auth middleware → Business logic → Data layer
                                          ↑
                                   Trust boundary
                                   All input must be validated here
```

Rules:
- All external input validated at the boundary, never inside business logic
- Business logic trusts validated input from the same trust zone
- Cross-service calls use service tokens, not user tokens
- Database layer receives only sanitized, typed data

## Pagination Convention

For list endpoints returning multiple items:

```typescript
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    hasNext: boolean
  }
}

// Query parameters
GET /users?page=1&pageSize=20&sort=createdAt&order=desc
```

## Versioning

```
/api/v1/users    # Current stable
/api/v2/users    # New version (when breaking changes needed)
```

Never remove a version without a deprecation period of at least 3 months.
