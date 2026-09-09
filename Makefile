PYTHON ?= .venv/bin/python

.PHONY: all build clean dev publish install

all: clean build publish

install:
	python3 -m venv .venv
	.venv/bin/pip install -r requirements.txt

build: install clean
	mkdocs build

dev: install
	mkdocs serve --watch docs --livereload

clean:
	rm -rf site

publish:
	putfs sync --overwrite ./site putfs://static.darc.zone/dataresearchcenter.org
