---
name: unit-testing
description: |-
  Comprehensive unit testing standards and patterns. Use when writing, reviewing, or improving unit tests for any function or module. Use proactively when implementing new functions (code-implementer), verifying logic (logic-verifier), or when asked to add tests. Examples:
  - user: "write tests for this function" → apply full test matrix
  - user: "implement loginUser()" → write implementation + tests
  - user: "is this function correct?" → trace + verify test coverage
license: MIT
metadata:
  version: "1.0"
  applies-to: code-implementer, logic-verifier
---

# Unit Testing Standards

## Test Matrix (Required for Every Function)

Every function must have tests covering all four categories:

### 1. Happy Path
Test normal valid input produces expected output.
```typescript
it('should return sorted array for valid input', () => {
  expect(quickSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5])
})
```

### 2. Invalid Input
Test malformed, missing, null, or out-of-range values.
```typescript
it('should throw ValidationError for null input', () => {
  expect(() => quickSort(null)).toThrow(ValidationError)
})
it('should throw ValidationError for non-array input', () => {
  expect(() => quickSort('not an array')).toThrow(ValidationError)
})
```

### 3. Boundary Conditions
Test empty, single element, maximum size, and edge values.
```typescript
it('should return empty array for empty input', () => {
  expect(quickSort([])).toEqual([])
})
it('should return same array for single element', () => {
  expect(quickSort([42])).toEqual([42])
})
it('should handle all identical elements', () => {
  expect(quickSort([5, 5, 5])).toEqual([5, 5, 5])
})
```

### 4. Security Edge Cases (for auth/data functions only)
Test injection attempts, unauthorized access, expired tokens.
```typescript
it('should reject SQL injection in email field', () => {
  expect(() => loginUser("'; DROP TABLE users;--", 'pass'))
    .toThrow(ValidationError)
})
it('should reject XSS payload in username', () => {
  expect(() => createUser('<script>alert(1)</script>', 'pass'))
    .toThrow(ValidationError)
})
it('should reject expired token', () => {
  expect(() => validateToken(EXPIRED_TOKEN)).toThrow(TokenExpiredError)
})
```

## Naming Convention

Use the pattern: `it('should [expected behavior] when [condition]')`

```typescript
// Good
it('should return 401 when token is missing')
it('should hash password before storing')
it('should throw RateLimitError after 5 failed attempts')

// Bad
it('test login')
it('works')
```

## Test File Structure

```typescript
describe('functionName', () => {
  // Setup
  let dependency: MockDependency

  beforeEach(() => {
    dependency = createMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('happy path', () => {
    it('should ...')
  })

  describe('invalid input', () => {
    it('should throw ValidationError when ...')
  })

  describe('boundary conditions', () => {
    it('should handle empty input')
    it('should handle maximum size')
  })

  describe('security', () => {
    // Only for auth/data functions
    it('should reject SQL injection')
  })
})
```

## Coverage Requirements

- Minimum 80% line coverage per function
- 100% coverage for authentication and authorization functions
- All documented `@throws` cases must have at least one test

## Mocking Guidelines

- Mock external dependencies (DB, API calls, file system)
- Never mock the function under test
- Use `jest.spyOn` for partial mocks
- Reset mocks in `afterEach` to prevent test pollution

## Checklist Before Marking Tests Complete

- [ ] Happy path test exists and passes
- [ ] All invalid input scenarios tested
- [ ] All boundary conditions tested
- [ ] Security cases tested (if auth/data function)
- [ ] All `@throws` annotations have corresponding tests
- [ ] Test names clearly describe the expected behavior
- [ ] No hardcoded test data that could expire (tokens, dates)
- [ ] Mocks are properly reset between tests
