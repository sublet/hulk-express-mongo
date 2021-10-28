default:
	npm install

build:
	npm run-script build:prod

start:
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
	./test/unit

test-all:
	npm run test

publish:
	npm publish --access public --dry-run

publish-prod:
	npm publish --access public

publish-post:
	cp ./package.json ./dist/package.json
	cp -R ./_templates ./dist/_templates