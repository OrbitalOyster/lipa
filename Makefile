DEBUG_CONFIG := PORT=8080 GIN_MODE=debug DB_HOST=127.0.0.1

build:
	docker compose build

run:
	docker compose up

debug:
	cd http && export $$(cat ../.env | xargs) && $(DEBUG_CONFIG) go run .

stop:
	docker compose down

service:
	docker compose up -d

logs:
	docker compose logs

clean:
	docker system prune -f
