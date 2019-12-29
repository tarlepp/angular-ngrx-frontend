.DEFAULT_GOAL := help
.PHONY: help
help:
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "[32m%-27s[0m %s\n", $$1, $$2}'

###> Get bash inside php container ###
bash: ## Get bash inside PHP container
	@docker-compose exec node bash
###< Get bash inside php container ###

###> Start application in development mode ###
start: ## Start application in development mode
	@docker-compose up
###< Start application in development mode ###

###> Start application in development mode and build containers ###
start-build: ## Start application in development mode and build containers
	@docker-compose up --build
###< Start application in development mode and build containers ###

###> Run start command with yarn ###
start-yarn: ## Run start command with yarn
	@yarn run start
###< Run start command with yarn ###

###> Fix file permissions ###
fix-permissions: ## Fix file permissions
	@chmod -R o+s+w /app
###< Fix file permissions ###
