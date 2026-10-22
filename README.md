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

Backup:
```bash
./backup.sh
```
