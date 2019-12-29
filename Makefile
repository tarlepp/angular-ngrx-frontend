###> Get bash inside php container ###
bash: ## Get bash inside PHP container
	@docker-compose exec node bash
###< Get bash inside php container ###

###> Start application in development more ###
start: ## Start application in development more
	@yarn run start
###< Start application in development more ###
