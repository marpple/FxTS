SHELL=/bin/sh
EXEC_PATH=./scripts

all: install plugin build

.PHONY: install
install:
	sh $(EXEC_PATH)/install.sh

.PHONY: plugin
plugin:
	sh $(EXEC_PATH)/plugin.sh

.PHONY: build
build:
	sh $(EXEC_PATH)/build.sh

.PHONY: clean
clean:
	sh $(EXEC_PATH)/clean.sh