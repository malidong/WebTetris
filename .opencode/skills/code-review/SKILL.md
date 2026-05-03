---
name: code-review
description: |-
  Code quality review standards covering correctness, maintainability, performance, and logic. Use when reviewing implemented functions or modules for quality issues beyond security. Use proactively after code-implementer completes a function, or when asked to review existing code. Examples:
  - user: "review this implementation" → run full code quality checklist
  - user: "is this correct?" → check logic, edge cases, and performance
  - user: "improve this code" → identify specific quality issues first
license: MIT
metadata:
  version: "1.0"
  applies-to: logic-verifier, code-implementer
---

# Code Review Standards

## Correctness Checklist

### Logic Verification
- [ ] Algorithm produces correct output for all documented inputs
- [ ] All `@throws` annotations have corresponding throw statements
- [ ] All `@requires` preconditions are enforced at function entry
- [ ] Return values match the documented return type
- [ ] Recursive functions have a valid base case
- [ ] Loops have guaranteed termination conditions
- [ ] Off-by-one errors checked (< vs <=, index bounds)

### Edge Case Coverage
- [ ] Empty input handled (empty array, empty string, null, undefined)
- [ ] Single element input handled
- [ ] Maximum size / overflow conditions handled
- [ ] Negative numbers handled (if applicable)
- [ ] Duplicate values handled (for sorting/searching)
- [ ] Concurrent access handled (if applicable)

## Execution Trace Protocol

For non-trivial algorithms, trace execution manually:

```
Function: quickSort([3, 1, 4, 1, 5])

Step 1: pivot = 4 (middle element)
Step 2: left = [3, 1, 1] (elements < pivot)
        middle = [4] (elements === pivot)
        right = [5] (elements > pivot)
Step 3: recurse quickSort([3, 1, 1])
        → pivot = 1, left = [], middle = [1, 1], right = [3]
        → result = [1, 1, 3]
Step 4: recurse quickSort([5])
        → base case, return [5]
Step 5: concat [1, 1, 3] + [4] + [5] = [1, 1, 3, 4, 5] ✓

Base case check: len <= 1 → return arr ✓
Termination: each recursive call gets smaller array ✓
```

## Complexity Analysis

Document time and space complexity for non-trivial functions:

| Complexity | Example | Acceptable for |
|------------|---------|----------------|
| O(1) | Hash lookup | Any scale |
| O(log n) | Binary search | Any scale |
| O(n) | Linear scan | Most cases |
| O(n log n) | Merge sort | Up to ~10M elements |
| O(n²) | Nested loops | Up to ~10K elements |
| O(2^n) | Brute force permutations | Up to ~20 elements |

Flag any O(n²) or worse algorithm operating on unbounded input.

## Maintainability Checklist

### Code Clarity
- [ ] Variable names describe their purpose (no `x`, `tmp`, `data`)
- [ ] Functions do one thing (Single Responsibility)
- [ ] Functions are short enough to understand without scrolling
- [ ] Complex logic has inline comments explaining *why*, not *what*
- [ ] Magic numbers replaced with named constants

### Error Handling
- [ ] All errors are caught or explicitly propagated
- [ ] Error messages are descriptive and actionable
- [ ] Error types are specific (not just `Error`)
- [ ] No silent catch blocks: `catch (e) {}`

### Code Duplication
- [ ] No copy-pasted blocks (extract to shared function)
- [ ] No repeated conditional patterns (extract to helper)

## Performance Checklist

- [ ] No unnecessary re-computation inside loops
- [ ] No N+1 query patterns (batch DB calls where possible)
- [ ] Large data structures not copied when reference suffices
- [ ] No blocking operations in async context without await
- [ ] Expensive operations cached when appropriate

## Output Format

```
Function: functionName
Verdict: PASS | FAIL | NEEDS_IMPROVEMENT

Execution Trace: [included for non-trivial algorithms]

Complexity:
  Time: O(?) — justification
  Space: O(?) — justification

Findings:
| Category | Severity | Location | Issue | Suggested Fix |
|----------|----------|----------|-------|---------------|
| Logic | High | line 23 | Off-by-one in loop | Change < n to <= n |
| Style | Low | line 45 | Magic number 86400 | Use SECONDS_PER_DAY const |

On PASS: Confirm agent-executor this function is complete.
On FAIL: Return specific findings to code-implementer.
```
