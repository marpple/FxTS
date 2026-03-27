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

I18N_DIR=../i18n

.PHONY: i18n-install
i18n-install:
	cd $(I18N_DIR) && npm install

.PHONY: i18n-sync
i18n-sync: i18n-install
	cd $(I18N_DIR) && npm run sync

.PHONY: i18n-check
i18n-check: i18n-install
	cd $(I18N_DIR) && npm run check