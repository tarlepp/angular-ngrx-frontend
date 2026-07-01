# Pull Request

## Summary

- Describe the change
- Explain why it is needed

## Validation

- [ ] Ran the smallest relevant checks for this change
- [ ] Ran markdown lint when documentation files changed
- [ ] Updated tests when behavior changed
- [ ] Updated translations when user-facing text changed
- [ ] Updated relevant documentation when behavior, architecture, workflow, or
      contributor-facing commands changed

## Repository architecture checklist

- [ ] Kept Angular code aligned with standalone component architecture
- [ ] Reused existing shared patterns before introducing new ones
- [ ] Used existing NgRx patterns when shared state changed
- [ ] Updated related actions, reducers, selectors, and effects together when
      shared state changed
- [ ] Avoided unrelated refactors
- [ ] Avoided new dependencies unless they were necessary

## AI-assisted workflow checklist

- [ ] No AI-created commit was made unless explicitly requested by a developer
- [ ] AI response included a concise summary of what changed and which files
      were touched
- [ ] When a commit was requested, AI showed planned commit scope before
      creating the commit
- [ ] AI asked for clarification instead of silently assuming missing behavior,
      API contract, UX text, or acceptance details

## Notes for reviewers

- Call out any architectural exception, trade-off, or follow-up work here
