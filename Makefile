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
install:
	humble exec api sh -c 'pwd && npm install'

# Single run tests
test-unit:
	humble exec api sh -c 'pwd && npm run test:unit'

test-e2e:
	humble exec api sh -c 'pwd && npm run test:e2e'

test: test-unit test-e2e

# Watching tests
unit:
	humble exec api sh -c 'pwd && npm run tdd:unit'

tdd:
	humble exec api sh -c 'pwd && npm run tdd:e2e'

# Gain access to the web application
ssh:
	humble exec api sh


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
