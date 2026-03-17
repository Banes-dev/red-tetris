# Compil
all:
	npm run dev

prod:
	npm run build

clean:
	rm -rf client/dist server/dist

.PHONY: all prod clean
