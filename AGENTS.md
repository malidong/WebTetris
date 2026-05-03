# AGENTS.md

## Project State
Empty repo — no source code, no root `package.json`, no `dist/`. Building a web-based Tetris game from scratch via the agent pipeline.

## Agent Pipeline (mandatory order)
```
architect → designer → security-reviewer → planner → agent-executor → code-implementer → logic-verifier
```
- Do not skip layers
- `security-reviewer` must PASS before implementation
- `logic-verifier` must PASS before marking complete

## Commands
- `npm run build` — Build npm package (root → `dist/`). **No root `package.json` exists yet — planner must create it**
- `cd .opencode && npm test` — Run plugin tests (none yet)

## Structure
- `/` — Root (target for Tetris game source + `dist/`)
- `/.opencode/` — OpenCode plugin config (agents, skills, plugin tests)
- Two `package.json` files: root (game) + `.opencode/` (plugin)

## Constraints
- No lint, no formatter, no database — just TypeScript build + plugin tests
- Never commit secrets or credentials
- Conventional Commits required (see git-workflow skill)
- Agent context: distribute tasks by complexity, not evenly

## Feedback Loops
- `security-reviewer` FAIL → back to `designer`
- `logic-verifier` FAIL → back to `code-implementer`
- Any agent finds ambiguity → escalate upward, never guess

## See Also
- `CLAUDE.md` — Full pipeline, skills reference, agent specs
- `.opencode/agents/*.md` — Individual agent configs
- `.opencode/skills/*/SKILL.md` — Skill definitions
