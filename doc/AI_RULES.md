# AI Rules for This Repository

## Why this document exists

This repository already has strong technical conventions, linting, translation
checks, and CI workflows. This document defines how to turn those conventions
into practical rules for AI-assisted changes.

The goal is simple:

- improve the quality of AI-generated changes,
- reduce repository drift,
- keep changes aligned with Angular and NgRx project patterns, and
- back important rules with automated checks whenever possible.

## Rule hierarchy

Use the following order of precedence when maintaining AI guidance:

1. System or tool-level safety and platform rules
2. Repository instruction files such as `.github/copilot-instructions.md`
3. Project context and architecture guidance in `CLAUDE.md`
4. Existing code, lint rules, tests, and CI workflows as the final source of
   truth for implementation details

If a rule in a documentation file conflicts with the existing codebase or CI,
update the documentation or the implementation so that they match.

## Scope

These rules apply to AI-assisted changes in the repository, including:

- code generation,
- refactoring,
- documentation updates,
- translation updates,
- tests, and
- dependency changes.

## Core repository rules

### 1. Follow the current Angular architecture

- Use standalone components.
- Do not introduce NgModules.
- Place new code under the existing feature-based structure in `src/app/`.
- Prefer existing shared building blocks under `src/app/shared/` before adding
  new ones.

### 2. Respect NgRx boundaries

- Use actions, reducers, selectors, and effects consistently for shared state.
- Use selectors for state reads.
- Keep side effects in effects or services.
- Avoid placing stateful business logic directly in presentational components.
- When a shared state behavior changes, review the corresponding actions,
  reducers, selectors, and effects as one unit instead of patching only a
  single layer.

### 3. Respect strict TypeScript

- Keep types explicit when inference is not clear.
- Avoid implicit `any`.
- Avoid weakening types simply to make code compile.
- Keep changes compatible with current lint and TypeScript rules.

### 4. Keep UI and styling consistent

- Prefer Angular Material and existing repository patterns.
- Follow the current SCSS structure and conventions.
- Avoid introducing new visual or styling patterns without a clear need.

### 5. Keep translations complete

Any new user-visible text must be reflected in both translation files:

- `src/assets/i18n/en.json`
- `src/assets/i18n/fi.json`

Translation-related changes should remain compatible with the repository's
translation extraction and validation commands.

### 6. Keep changes small and relevant

- Prefer minimal, task-focused edits.
- Avoid unrelated refactors.
- Preserve public APIs unless the task requires a change.
- Reuse existing dependencies before proposing new ones.

### 7. Use the running development container for project commands

- Treat the running `node` container as the default environment for day-to-day
  development work.
- Run repository commands such as `yarn`, `ng`, lint, test, and translation
  checks inside that container.
- When working from the host shell, prefer the existing `make` targets that
  call into the running container rather than executing project tooling on the
  host directly.
- Reserve host-level command execution for tasks that genuinely belong to the
  host environment, such as Docker lifecycle or Git operations.

### 8. Keep versioned documentation lightweight

- Avoid duplicating fast-changing dependency or tooling versions in long-form AI
  guidance when the repository already has a clear source of truth.
- Prefer referencing files such as `package.json`, `Dockerfile`,
  `.github/actions/setup-yarn/action.yml`, and `angular.json` instead of
  maintaining the same version numbers in multiple documents.
- If an exact version matters for a change, read it from the source file rather
  than assuming that a documentation file is current.

## Enforcement model

Not all AI rules can be enforced automatically. Use the following model:

### Documentation-only rules

These are guidance-heavy and should remain concise and stable:

- prefer minimal edits,
- follow existing project patterns,
- keep business logic out of presentation components, and
- reuse existing shared building blocks first.

### Automatically enforceable rules

These should be validated through repository tooling and CI whenever possible:

- TypeScript linting,
- SCSS linting,
- translation extraction consistency,
- untranslated key detection, and
- build success.

## Current validation commands

From repository root inside the running development container, the main
validation commands are:

```bash
yarn lint:ts
yarn lint:scss
yarn test
yarn extract-translations
yarn check-translations
```

## Current CI alignment

At the time of writing, `.github/workflows/main.yml` already includes checks
for:

- TypeScript linting,
- SCSS linting,
- markdown documentation linting,
- translation extraction drift, and
- untranslated text tags.

That means the most effective starting point for AI rules in this repository is
not more process, but clearer instruction files that map directly to these
existing checks.

## Recommended maintenance workflow

When a repeated AI mistake appears, follow this sequence:

1. Decide whether the issue is a one-off or a recurring pattern.
2. If recurring, add or tighten a short repository rule.
3. If possible, back that rule with linting, tests, or CI.
4. Keep the rule short, concrete, and tied to a repository path or command.
5. Remove or simplify rules that no longer reflect the codebase.

As a practical default, update the AI rules when the same architectural or
review comment appears multiple times, or when a new project convention is added
that AI assistants should follow by default.

## Contributor workflow for AI-assisted changes

When using AI assistance in this repository, keep the workflow lightweight:

1. Start with `.github/copilot-instructions.md` for short operational rules.
2. Use `CLAUDE.md` when you need broader project context or architecture notes.
3. Make the smallest change that fits existing Angular, NgRx, and i18n
   patterns.
4. Run the smallest relevant validation commands for the files you changed
   inside the running development container.
5. Use `.github/pull_request_template.md` as the review checklist when opening
   pull requests.
6. If a reviewer repeats the same correction pattern, update the AI guidance so
   future changes start from the improved rule.

## CI strategy for recurring AI mistakes

When the same AI-generated mistake appears repeatedly, prefer converting that
problem into an automated repository check instead of relying only on reviewer
memory.

Use this progression:

1. Document the rule in `.github/copilot-instructions.md` if it should affect
   day-to-day AI output.
2. Add or update tests, lint rules, or workflow checks if the mistake is
   machine-detectable.
3. Keep the check close to the existing project tool that already owns that
   concern.

For this repository, the preferred enforcement order is:

- ESLint for TypeScript, Angular, and NgRx usage patterns,
- Stylelint for SCSS issues,
- unit tests for behavior and state flow,
- translation extraction and translation validation for i18n drift, and
- GitHub Actions workflow updates only when the existing commands are not
  enough.

Examples:

- If AI keeps bypassing selectors and reading store shape directly, prefer an
  ESLint or NgRx rule before adding more documentation text.
- If AI keeps introducing untranslated user-facing strings, keep translation
  checks in CI and tighten review guidance around `en.json` and `fi.json`.
- If AI keeps changing behavior without updating tests, add or expand targeted
  unit tests in the affected feature.

Before adding a new CI rule, check that it is:

- specific to a recurring problem,
- understandable from the failure output,
- aligned with the current architecture, and
- unlikely to create noisy false positives.

Prefer extending existing jobs in `.github/workflows/main.yml` over creating a
new workflow unless the new check has a clearly different lifecycle or runtime
need.

### Examples of enforceable AI rules for this repository

These are good candidates when a recurring AI mistake becomes common enough to
justify automation:

- Require selector-based store reads instead of direct state shape access where
  existing NgRx lint rules or custom linting can detect the pattern.
- Require translation updates when new user-facing text is introduced in
  templates or components.
- Require affected unit tests to be updated when reducers, effects, or feature
  behavior changes.
- Require existing shared Angular Material or shared component patterns to be
  reused before introducing new parallel UI abstractions, when that can be
  validated in review or supported by targeted lint guidance.

Not every example needs immediate automation. Use them as a backlog of likely
enforcement candidates when the same class of AI-generated issue repeats.

## Good rule-writing patterns

Prefer rules that are concrete and testable.

Better examples:

- New shared application state must use the existing NgRx structure under
  `src/app/store/`.
- New user-facing text must be added to both translation files.
- New UI should reuse Angular Material or existing shared components first.

Avoid vague rules such as:

- follow best practices,
- write clean code, or
- keep things consistent.

## Suggested next improvements

After this first implementation, consider the following enhancements:

- evaluate which recurring AI issues from the examples section should become
  automated checks,
- tighten CI if a repeated class of regressions appears,
- add review checklist items for architectural exceptions, and
- periodically prune rules that duplicate lint or test enforcement.

## Related files

- `README.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `.github/pull_request_template.md`
- `.github/workflows/main.yml`
