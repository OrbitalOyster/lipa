ENV_FILE=.env

include ${ENV_FILE}
export

DEBUG_CONFIG := PORT=14002 \
				GIN_MODE=debug \
				DB_HOST=127.0.0.1 \
				DB_PORT=${DB_EXTERNAL_PORT}

build:
	docker compose build

run:
	docker compose up

stop:
	docker compose down

service:
	docker compose up -d

logs:
	docker compose logs

clean:
	docker system prune -f

# Don't spawn separate shell for every command
.ONESHELL:

debug:
	@trap 'docker container stop lipa-debug1' INT # Stop nginx container on Ctrl-C
	docker run -p 8080:8080 --add-host=localhost:host-gateway \
		--name lipa-debug1 --rm -d \
		-v ./nginx/nginx-debug.conf:/etc/nginx/nginx.conf:ro \
		-v ./static/:/usr/share/nginx/html nginx:latest
	cd http
	$(DEBUG_CONFIG) go run .
