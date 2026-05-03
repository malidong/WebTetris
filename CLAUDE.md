# Project Context

## Tech Stack
TypeScript, Node.js, @slack/web-api, @opencode-ai/plugin

## Development Commands
```bash
npm run build           # Build npm package (root → dist/)
cd .opencode && npm test  # Run plugin tests
```

## Agent Pipeline

This project uses a 6-layer agent pipeline with integrated skills.
**Always follow this order — do not skip layers.**

```
architect → designer → security-reviewer → planner → agent-executor → code-implementer → logic-verifier
```

### Agent Reference

| Layer | Agent | Model | Skills | Responsibility |
|-------|-------|-------|--------|----------------|
| 1. Strategy | `architect` | Opus 4.7 | documentation-standards, api-interface-standards | System design, threat modeling, ADRs |
| 2. Design | `designer` | Sonnet 4.6 | api-interface-standards, security-review, documentation-standards | Module breakdown, interface specs |
| 3. Security Gate | `security-reviewer` | Sonnet 4.6 | security-review | OWASP review — PASS to proceed, FAIL to redesign |
| 4. Planning | `planner` | Qwen3-14B | api-interface-standards, git-workflow, docker-deployment, documentation-standards | File structure, function signatures, task ordering |
| 5. Execution | `agent-executor` | Qwen3.6-35B | git-workflow, docker-deployment, documentation-standards | Coordinate implementation, file creation, commits |
| 6. Implementation | `code-implementer` | Qwen2.5-Coder | unit-testing, security-review, documentation-standards | Function-level code and unit tests |
| 7. Verification | `logic-verifier` | DeepSeek-R1 | code-review, unit-testing | Algorithm correctness, complexity, test coverage |

## Skills Reference

| Skill | Used By | Purpose |
|-------|---------|---------|
| `unit-testing` | code-implementer, logic-verifier | Test matrix: happy path, invalid input, boundary, security |
| `security-review` | security-reviewer, designer, code-implementer | OWASP Top 10 checklist, input validation rules |
| `code-review` | logic-verifier, code-implementer | Correctness, complexity, maintainability checklist |
| `api-interface-standards` | architect, designer, planner | Function signature format, REST conventions, annotations |
| `docker-deployment` | planner, agent-executor | Dockerfile patterns, docker-compose, nginx config |
| `git-workflow` | planner, agent-executor, code-implementer | Conventional commits, branching, repo structure |
| `documentation-standards` | architect, designer, code-implementer | JSDoc, README template, ADR format |

## Feedback Loops

```
security-reviewer FAIL  → back to designer
logic-verifier FAIL     → back to code-implementer
Any agent finds ambiguity → escalate upward, never guess
```

## Key Constraints 
- No implementation proceeds without security-reviewer PASS
- No function is complete without logic-verifier PASS
- All commits must follow Conventional Commits format (git-workflow skill)
- Never commit secrets, tokens, or credentials

## Project-Specific Rules
- This repo is both an npm package AND an OpenCode plugin — two package.json files exist (root + .opencode/)
- Tests run from `.opencode/`, not root
- Build output goes to `dist/` at root
- No database, lint, or formatter in this project — just TypeScript build + plugin tests
