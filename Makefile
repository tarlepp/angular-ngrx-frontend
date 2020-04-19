ifneq ("$(wildcard /.dockerenv)", "")
	INSIDE_DOCKER = 1
else
	INSIDE_DOCKER = 0
endif

WARNING_HOST = @printf "\033[31mThis command cannot be run inside docker container!\033[39m\n"
WARNING_DOCKER = @printf "\033[31mThis command must be run inside docker container!\nUse 'make bash' command to get shell inside container.\033[39m\n"

.DEFAULT_GOAL := help
.PHONY: help
help:
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "[32m%-27s[0m %s\n", $$1, $$2}'

###> Get bash inside php container ###
bash: ## Get bash inside PHP container
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@docker-compose exec node bash
endif
###< Get bash inside php container ###

###> Start application in development mode ###
start: ## Start application in development mode
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@docker-compose up
endif
###< Start application in development mode ###

###> Stop application containers ###
stop: ## Stop application containers
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@docker-compose down
endif
###< Stop application containers ###

###> Start application in development mode and build containers ###
start-build: ## Start application in development mode and build containers
ifeq ($(INSIDE_DOCKER), 1)
	$(WARNING_HOST)
else
	@docker-compose up --build
endif
###< Start application in development mode and build containers ###

###> Run start command with yarn ###
start-yarn: ## Run start command with yarn
ifeq ($(INSIDE_DOCKER), 1)
	@yarn run start
else
	$(WARNING_DOCKER)
endif
###< Run start command with yarn ###

###> Fix file permissions ###
fix-permissions: ## Fix file permissions
ifeq ($(INSIDE_DOCKER), 1)
	@chmod -R o+s+w /app
else
	$(WARNING_DOCKER)
endif
###< Fix file permissions ###
