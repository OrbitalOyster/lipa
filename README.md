Requirements:

* git
* docker compose
* make
* storage folder
* config.env file

Downloading and building:
```bash
git clone https://github.com/orbitaloyster/lipa.git --recurse-submodules
cd lipa
cp example.env config.env
make build
```

Running:
```bash
make run
```

Running as service:
```bash
make service
```

Stopping:
```bash
make stop
```

Clean up:
```bash
make clean
```
