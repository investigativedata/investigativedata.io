export DIRECTUS_SITE ?= dataresearchcenter.org

PYTHON ?= .venv/bin/python

.PHONY: all build fetch clean dev serve publish install

all: clean build

install:
	python3 -m venv .venv
	.venv/bin/pip install -r requirements.txt

fetch:
	$(PYTHON) build.py

build: fetch
	zola build

dev: fetch
	zola serve

clean:
	rm -rf content/ data/ public/

serve:
	cd public && python3 -m http.server

publish: build
	aws s3 --endpoint-url https://s3.investigativedata.org sync ./public s3://$(DIRECTUS_SITE)
