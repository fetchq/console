# Running container's name
organization?=$(shell node -p "require('./package.json').organization")
name?=$(shell node -p "require('./package.json').name")
version:=$(shell node -p "require('./package.json').version")

# Docker image tag name
tag?=${organization}/${name}

install:
	@echo "-- Installing NPM Dependencies..."
	@humble pull
	@humble up install
	@humble rm -f install

# Boot development environment
start:
	@echo "-- Starting Project..."
	@humble up -d postgres
	@humble up -d api app
	@humble logs -f api app

api:
	@echo "-- Starting API..."
	@humble up -d postgres
	@humble up -d api
	@humble logs -f api

styleguide:
	@echo "-- Starting Styleguide..."
	@humble stop styleguide
	@humble rm -f styleguide
	@humble up -d styleguide
	@humble logs -f styleguide

stop:
	@echo "-- Terminating Project..."
	@humble down

# Single run tests
test-unit:
	@echo "-- Running Unit Tests on APIs..."
	@humble exec api sh -c 'pwd && npm run test:unit'

test-client:
	@echo "-- Running Unit Tests on Client..."
	@humble exec api sh -c 'pwd && npm run test:client'

test-e2e:
	@echo "-- Running E2E Tests..."
	@humble exec api sh -c 'pwd && npm run test:e2e'

test: test-unit test-e2e

# Watching tests
tdd-unit:
	@echo "-- Starting a TDD session on Unit Tests on APIs..."
	@humble exec api sh -c 'pwd && npm run tdd:unit'

tdd-client:
	@echo "-- Starting a TDD session on Unit Tests on Client..."
	@humble exec api sh -c 'pwd && npm run tdd:client'

tdd-e2e:
	@echo "-- Starting a TDD session on E2E Tests..."
	@humble exec api sh -c 'pwd && npm run tdd:e2e'

# Gain access to the web application
ssh:
	humble exec api sh


###
### Use Docker for Production
### =========================
###

# Build the project using cache
image:
	docker build -t ${tag} -t ${organization}/${name}:${version} .

publish: image
	docker push ${organization}/${name}:${version}
	docker push ${organization}/${name}:latest

# Spins up a container from the latest available image
# this is useful to test locally
prod: image
	docker run \
		--rm \
		--name ${name} \
		--env PGSTRING=${pgstring} \
		-p 8080:8080 \
		${tag}
