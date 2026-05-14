ifneq ("$(wildcard /.dockerenv)", "")
	INSIDE_DOCKER = 1
else
	INSIDE_DOCKER = 0
endif

# Global variables that we're using
HOST_UID := $(shell id -u)
HOST_GID := $(shell id -g)
DOCKER := $(shell which docker)

ifdef DOCKER
	IS_RUNNING := $(shell docker ps -f name=angular-ngrx-frontend | grep angular-ngrx-frontend)
else
	IS_RUNNING := '';
endif

WARNING_HOST = @printf "\033[31mThis command cannot be run inside docker container!\033[39m\n"
WARNING_DOCKER = @printf "\033[31mThis command must be run inside docker container and it's not running!\nUse 'make start' command to get container running and after that run this command again.\033[39m\n"
NOTICE_HOST = @printf "\033[33mRunning command from host machine by using 'docker compose exec' command\033[39m\n"

# Run a command and decorate output for handled exit codes (1 and 2).
# Usage: $(call RUN_WITH_DECORATED_EXIT_OUTPUT,<command>,<label>)
define RUN_WITH_DECORATED_EXIT_OUTPUT
	@$(1); \
	status=$$?; \
	case "$$status" in \
		0) exit 0 ;; \
		1|2) \
			printf "\033[1;31m[%s]\033[0;31m exited with code \033[1;33m%s\033[0;31m - see output above.\033[39m\n" "$(2)" "$$status"; \
			exit 0 ;; \
		*) exit "$$status" ;; \
	esac
endef

ifndef VERBOSE
MAKEFLAGS += --no-print-directory
endif

.DEFAULT_GOAL := help
.PHONY: help
help:
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "[32m%-27s[0m %s\n", $$1, $$2}'

bash: ## Get bash inside Node container
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node bash
endif

fish: ## Get fish inside Node container
ifeq ($(INSIDE_DOCKER_CONTAINER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node fish
endif

start: ## Start application in development mode
ifeq ($(INSIDE_DOCKER), 1)
	@make start-yarn
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose up
endif

start-production: ## Start application locally in production mode
ifeq ($(INSIDE_DOCKER), 1)
	@make start-yarn-prod
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) PROD_MODE=1 docker compose up
endif

stop: ## Stop application containers
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose down
endif

start-build: ## Start application in development mode and build containers
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose up --build
endif

start-yarn: ## Run start command with yarn
ifeq ($(INSIDE_DOCKER), 1)
	@yarn run start
else
	$(WARNING_DOCKER)
endif

start-yarn-prod: ## Run start-prod command with yarn
ifeq ($(INSIDE_DOCKER), 1)
	@yarn run start-prod
else
	$(WARNING_DOCKER)
endif

lint: ## Lint TypeScript and SCSS files
ifeq ($(INSIDE_DOCKER), 1)
	@make lint-ts
	@make lint-scss
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make lint
endif

lint-ts: ## Lint TypeScript files
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mLinting TypeScript files\033[39m"
	@yarn run lint:ts
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make lint-ts
endif

lint-scss: ## Lint SCSS files
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mLinting SCSS files\033[39m"
	@yarn run lint:scss
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make lint-scss
endif

fix: ## Fix TypeScript and SCSS files
ifeq ($(INSIDE_DOCKER), 1)
	@make fix-ts
	@make fix-scss
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make fix
endif

fix-ts: ## Fix TypeScript files
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mFixing TypeScript files\033[39m"
	@yarn run fix:ts
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make fix-ts
endif

fix-scss: ## Fix SCSS files
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mFixing SCSS files\033[39m"
	@yarn run fix:scss
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make fix-scss
endif

extract-translations: ## Extract translations from TypeScript and HTML template files
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mExtracting translations\033[39m"
	@yarn run extract-translations
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make extract-translations
endif

check-translations: ## Check missing translations
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mChecking translations\033[39m"
	@yarn run check-translations
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make check-translations
endif

update: ## Upgrade dependencies via yarn interactively
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32m\033[39m"
	@yarn upgrade-interactive
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make update
endif

docker-kill-containers: ## Kill all running docker containers
ifeq ($(INSIDE_DOCKER_CONTAINER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker kill $$(docker ps -q)
endif

docker-remove-containers: ## Remove all docker containers
ifeq ($(INSIDE_DOCKER_CONTAINER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker rm $$(docker ps -a -q)
endif

docker-remove-images: ## Remove all docker images
ifeq ($(INSIDE_DOCKER_CONTAINER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker rmi $$(docker images -q)
endif

generate-ssl-cert: ## Generate self signed SSL certificate
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@echo "\033[32mGenerating self signed SSL certificate\033[39m"
	@cd docker/ssl && ./create-keys.sh
endif

check-action-updates: ## Check pinned GitHub Actions and available updates
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mChecking GitHub Action pins and updates\033[39m"
	$(call RUN_WITH_DECORATED_EXIT_OUTPUT,./scripts/check-action-updates.sh,check-action-updates)
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make check-action-updates
endif


project-stats: ## Create simple project stats
ifeq ($(INSIDE_DOCKER), 1)
	@echo "\033[32mGenerating project statistics\033[39m"
	@./scripts/project-stats.sh
else ifeq ($(strip $(IS_RUNNING)),)
	$(WARNING_DOCKER)
else
	$(NOTICE_HOST)
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker compose exec node make project-stats
endif
