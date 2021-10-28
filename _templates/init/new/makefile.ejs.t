---
to: Makefile
---
default:
	npm install

start:
	rm -rf .build
	npm start

lint:
	npm run lint

clean:
	rm -rf node_modules
	npm cache clean --force
	npm install

test-unit:
	NODE_ENV=test \
	npx mocha --exit \
	./test/unit/**/*.test.js

test-int:
	NODE_ENV=test \
	npx mocha --exit \
	./test/integration/**/*.test.js

test-all: test-unit test-int

ngrok:
	ngrok http 3040 -subdomain=hulk-api