# Running container's name
organization?=$(shell node -p "require('./package.json').organization")
name?=$(shell node -p "require('./package.json').name")
version:=$(shell node -p "require('./package.json').version")

# Docker image tag name
tag?=${organization}/${name}


# Boot development environment
start:
	humble up -d postgres
	humble up -d api app
	humble logs -f api app postgres

stop:
	humble down

# Single run tests
test-unit:
	humble exec webapp sh -c 'pwd && yarn test:unit'
test-e2e:
	humble exec webapp sh -c 'pwd && yarn test:e2e'
test: test-unit test-e2e

# Watching tests
unit:
	humble exec webapp sh -c 'pwd && yarn tdd:unit'
tdd:
	humble exec webapp sh -c 'pwd && yarn tdd:e2e'

# Gain access to the web application
ssh:
	humble exec webapp sh


###
### Use Docker for Production
### =========================
###

# Build the project using cache
image:
	docker build -t ${tag} -t ${tag}:${version} .

# Spins up a container from the latest available image
# this is useful to test locally
prod: image
	docker run \
		--rm \
		--name ${name} \
		--env PGSTRING=${pgstring} \
		-p 8080:8080 \
		${tag}
