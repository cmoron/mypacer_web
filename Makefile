.PHONY: help install test lint format check fix clean ci

help: ## Show help for make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install development dependencies
	npm ci

test: ## Run tests
	npm run test:run

coverage: ## Run tests with coverage
	npm run coverage
	@echo "📊 HTML report generated in coverage/index.html"

lint: ## Check code quality (eslint)
	@echo "Linting with eslint..."
	npm run lint

format: ## Format code with prettier
	@echo "Formatting with prettier..."
	npm run format

format-check: ## Check code formatting without modifying files
	@echo "Checking formatting with prettier..."
	npm run format:check

check: lint test ## Run all checks (lint + tests)

fix: format ## Automatically fix formatting issues
	@echo "Auto-fixing eslint issues..."
	npm run lint -- --fix

clean: ## Clean up temporary files
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage
	rm -rf .vite
	rm -f package-lock.json

ci: ## Simulate the CI pipeline locally
	@echo "--- CI Simulation ---"
	@echo "\n1. Checking formatting..."
	npm run format:check || (echo "❌ Formatting check failed" && exit 1)
	@echo "✅ Formatting OK"
	@echo "\n2. Linting..."
	npm run lint || (echo "❌ Linter check failed" && exit 1)
	@echo "✅ Linter OK"
	@echo "\n3. Running tests with coverage..."
	npm run coverage || (echo "❌ Tests failed" && exit 1)
	@echo "\n✅ All checks passed!"
