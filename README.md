# lipa

Requirements:
* docker
* docker buildx
* docker compose
* storage folder for db
* .env file

To run:
```bash
docker compose build
docker compose up -d
```

To view logs:
```bash
docker compose logs
```

To stop:
```bash
docker compose down
```

To access DB:
```bash
docker exec -it lipa-db-1 mariadb -u INSERT_DB_USER -p INSERT_DB_NAME
```
