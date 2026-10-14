Requirements:

* git
* docker
* .env file
* empty folder for data

Downloading and building:
```bash
git clone https://github.com/orbitaloyster/lipa.git --recurse-submodules
cd lipa
cp example.env .env
docker compose build
```

Running:
```bash
docker compose run -d
```
