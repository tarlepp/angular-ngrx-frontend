# What is this?

This document contains basic checklist what _you_ need to do if you're going to
use this template as in base of your own application.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Checklist](#checklist)

## Checklist [ᐞ](#table-of-contents)

Below you have _basic_ checklist that **_you need to go through_** after you have
started to use this template.

* [ ] Check that [LICENSE](../LICENSE) matches to your needs and change it if
      needed.
* [ ] Check that [README.md](../README.md) contains only things related to your
      application.
* [ ] Update [package.json](../package.json) to match with your application.
      Below you see the parts that you should check/update;
  * [ ] Common properties; `name`, `description`, `author`, `license`,
        `homepage`, `keywords` and `bugs`
* [ ] Update [compose.yaml](../compose.yaml) to match with your
  application. Below you see the parts that you should check/update;
  * [ ] Change `container_name` to match your application
* [ ] GitHub Actions - This application is using GitHub Actions to run multiple
      jobs to check application code.
  * [ ] [main.yml](../.github/workflows/main.yml) - Check file contents and
        modify it for your needs.
  * [ ] [vulnerability-scan.yml](../.github/workflows/vulnerability-scan.yml) -
        Check file contents and modify it for your needs.
  * [ ] [ACTIONS_UPDATE.md](ACTIONS_UPDATE.md) - Review the GitHub
        Actions pinning/update process and adapt it for your project.
  * [ ] Run `make check-action-updates` after workflow changes to verify pins,
        version consistency, and available updates.
* [ ] Review the AI-assisted change policy files: `.github/copilot-instructions.md`,
      `CLAUDE.md`, and [AI_RULES.md](AI_RULES.md). Update or replace them so
      they match your own architecture, workflow, and review expectations.
* [ ] Delete this file.

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
