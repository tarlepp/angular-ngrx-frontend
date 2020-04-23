ifneq ("$(wildcard /.dockerenv)", "")
	INSIDE_DOCKER = 1
else
	INSIDE_DOCKER = 0
endif

# Global variables that we're using
HOST_UID := $(shell id -u)
HOST_GID := $(shell id -g)
WARNING_HOST = @printf "\033[31mThis command cannot be run inside docker container!\033[39m\n"
WARNING_DOCKER = @printf "\033[31mThis command must be run inside docker container!\nUse 'make bash' command to get shell inside container.\033[39m\n"

.DEFAULT_GOAL := help
.PHONY: help
help:
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "[32m%-27s[0m %s\n", $$1, $$2}'

bash: ## Get bash inside Node container
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker-compose exec node bash
endif

start: ## Start application in development mode
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker-compose up
endif

stop: ## Stop application containers
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker-compose down
endif

start-build: ## Start application in development mode and build containers
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) docker-compose up --build
endif

start-yarn: ## Run start command with yarn
ifeq ($(INSIDE_DOCKER), 1)
	@yarn run start
else
	$(WARNING_DOCKER)
endif
