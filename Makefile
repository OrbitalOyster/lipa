# Only thing to edit here
ENV_FILE=config.env
# No edits below

include ${ENV_FILE}
export

DEBUG_CONFIG := PORT=8080 \
				GIN_MODE=debug \
				DB_HOST=127.0.0.1 \
				DB_PORT=${DB_EXTERNAL_PORT}

build:
	docker compose build

run:
	docker compose up

debug:
	cd http && $(DEBUG_CONFIG) go run .

stop:
	docker compose down

service:
	docker compose up -d

logs:
	docker compose logs

clean:
	docker system prune -f
