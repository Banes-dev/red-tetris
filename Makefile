# Compil
all: 	server client

client:
	cd client && npm run dev &

server:
	cd server && npm run dev &

prod:
	cd server && npm run build
	cd client && npm run build

clean:
	rm -rf client/dist server/dist

.PHONY: all client server prod clean
