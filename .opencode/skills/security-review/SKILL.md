---
name: security-review
description: |-
  Security review checklist and vulnerability patterns. Use when reviewing interface designs, code changes, or architecture decisions for security issues. Use proactively for any code touching authentication, authorization, data storage, input handling, or external APIs. Examples:
  - user: "review this login function" → run full security checklist
  - user: "is this API design safe?" → check trust boundaries and input validation
  - user: "design the user module" → apply security requirements to interface spec
license: MIT
metadata:
  version: "1.0"
  applies-to: security-reviewer, designer, code-implementer
---

# Security Review Standards

## OWASP Top 10 Checklist

Run this checklist on every security-relevant code review or design review.

### A01: Broken Access Control
- [ ] All endpoints enforce authentication
- [ ] Authorization checks happen server-side, not client-side
- [ ] Users cannot access other users' resources (IDOR check)
- [ ] Principle of least privilege applied to all roles
- [ ] Direct object references use indirect references or access control checks

### A02: Cryptographic Failures
- [ ] No sensitive data transmitted over unencrypted channels
- [ ] No deprecated algorithms: MD5, SHA1, DES, RC4
- [ ] Passwords hashed with bcrypt, argon2, or scrypt (not SHA256)
- [ ] Encryption keys not hardcoded or stored in source code
- [ ] TLS enforced for all external communication

### A03: Injection
- [ ] All SQL queries use parameterized statements or ORM
- [ ] No string concatenation in queries: `"SELECT * FROM users WHERE id = " + userId`
- [ ] No eval() or dynamic code execution with user input
- [ ] Shell commands do not include user-controlled data
- [ ] XML/JSON parsers configured to prevent XXE

### A04: Insecure Design
- [ ] Threat model documented for sensitive features
- [ ] Rate limiting applied to authentication endpoints
- [ ] Account lockout after repeated failed attempts
- [ ] Sensitive operations require re-authentication

### A05: Security Misconfiguration
- [ ] Default credentials changed
- [ ] Debug mode disabled in production
- [ ] Error messages do not expose stack traces or internal paths
- [ ] Unnecessary features/endpoints disabled
- [ ] Security headers set (CSP, X-Frame-Options, HSTS)

### A06: Vulnerable Components
- [ ] Dependencies checked against known CVE databases
- [ ] No outdated packages with known vulnerabilities
- [ ] Lock files committed to prevent dependency confusion

### A07: Authentication Failures
- [ ] Session tokens are cryptographically random (min 128 bits)
- [ ] Tokens invalidated on logout
- [ ] Password reset flow does not leak account existence
- [ ] Multi-factor authentication available for sensitive operations
- [ ] Brute force protection on login endpoints

### A08: Software and Data Integrity
- [ ] No untrusted data deserialized without validation
- [ ] Package integrity verified (checksums, signatures)
- [ ] CI/CD pipeline protected from unauthorized access

### A09: Security Logging
- [ ] Authentication events logged (success, failure, logout)
- [ ] Authorization failures logged
- [ ] PII not logged in plain text
- [ ] Log injection prevented (user input sanitized before logging)
- [ ] Logs shipped to tamper-resistant storage

### A10: Server-Side Request Forgery
- [ ] User-supplied URLs validated against allowlist
- [ ] Internal network addresses blocked from SSRF
- [ ] Redirects do not follow arbitrary URLs

## Input Validation Rules

Apply these rules to all user-supplied input:

```typescript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) throw new ValidationError('Invalid email format')

// String length limits
if (username.length > 100) throw new ValidationError('Username too long')
if (username.length < 3) throw new ValidationError('Username too short')

// SQL injection prevention — always use parameterized queries
// ❌ NEVER do this
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ Always do this
const query = 'SELECT * FROM users WHERE email = $1'
const result = await db.query(query, [email])
```

## Severity Classification

| Severity | Examples | Action |
|----------|----------|--------|
| Critical | SQL injection, auth bypass, RCE | Block — do not proceed |
| High | IDOR, XSS, sensitive data exposure | Block — do not proceed |
| Medium | Missing rate limiting, verbose errors | Flag — fix before release |
| Low | Missing security headers, minor info leak | Flag — fix in next sprint |
| Info | Best practice suggestions | Note — optional improvement |

## Output Format

```
Verdict: PASS | FAIL

Findings:
| Severity | Location | Issue | Remediation |
|----------|----------|-------|-------------|
| High | auth/login.ts:42 | Raw SQL query | Use parameterized query |

On PASS: Confirm implementation can proceed.
On FAIL: Return to designer/implementer with specific findings.
         Do not approve until all Critical and High findings resolved.
```
