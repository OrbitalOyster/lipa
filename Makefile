# Only thing to edit here
ENV_FILE=.env
# No edits below

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

debug1:
	docker run -p 8080:8080 --add-host=localhost:host-gateway -v ./nginx/nginx-debug.conf:/etc/nginx/nginx.conf:ro -v ./static/:/usr/share/nginx/html nginx:latest

debug2:
	cd http && $(DEBUG_CONFIG) go run .

stop:
	docker compose down

service:
	docker compose up -d

logs:
	docker compose logs

clean:
	docker system prune -f
