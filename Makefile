install:
	npm i
	npm i ../style
	rm -rf ./node_modules/@emotion/react
	cd ./node_modules/@emotion ; ln -s ../../../style/node_modules/react .
