all: clean publish

install:
	npm i
	npm i ../style
	rm -rf ./node_modules/@emotion/react
	cd ./node_modules/@emotion ; ln -s ../../../style/node_modules/react .

out:
	PREVIEW=0 EXPORT=1 npm run build

publish: out
	aws s3 --endpoint-url https://s3.investigativedata.org sync ./out s3://investigativedata.io 

clean:
	rm -rf out

serve:
	cd out ; python3 -m http.server
