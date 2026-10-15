#!/bin/bash

source .env
echo "Archiving $DATA_FOLDER..."

mkdir -p backups
TIME=$(date "+%Y-%m-%d_%H-%M-%S")
tar -czf backups/$TIME-backup.tar.gz -C $DATA_FOLDER .

echo "Done"
