.PHONY: prettier lint tsc fix

prettier:
	npx prettier --write .

lint:
	npm run lint

tsc:
	npx tsc --noEmit

fix: prettier lint tsc
