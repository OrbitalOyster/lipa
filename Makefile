ENV_FILE=.env

include ${ENV_FILE}
export

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
	@trap 'docker container stop lipa-debug' INT EXIT # Stop nginx container on exit
	# Add localhost as viable proxy
	# Set container name, make it delete itself after
	# Set enviroment variables
	# Add volumes
	docker run -p ${DEBUG_PORT}:${HTTP_PORT} --add-host=localhost:host-gateway \
		--name lipa-debug -d --rm \
		-e HTTP_HOST=localhost -e HTTP_PORT -e TZ \
		-v ./nginx-templates/:/etc/nginx/templates:ro \
		-v ./static/:/usr/share/nginx/html nginx:latest
	cd http
	PORT=${HTTP_PORT} GIN_MODE=debug DB_HOST=127.0.0.1 DB_PORT=${DB_EXTERNAL_PORT} go run cmd/main.go # Run actual server
