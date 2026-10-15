package main

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var pool *pgxpool.Pool

func ConnectPool() {
	var err error
	/* Parse connection string */
	pgxConfig, err := pgxpool.ParseConfig(postgresConfig.String())
	if err != nil {
		panic(err)
	}
	/* Custom options */
	pgxConfig.MaxConns = 16
	pgxConfig.MaxConnLifetime = time.Minute * 5
	pgxConfig.MaxConnIdleTime = time.Minute
	/* Create pool */
	pool, err = pgxpool.NewWithConfig(context.Background(), pgxConfig)
	if err != nil {
		panic("Unable to connect to DB" + err.Error())
	}
}

func GetUserId(username string, password string) (id int) {
	const query = "SELECT id FROM lipa.users WHERE username = $1 AND password_hash = encode(sha256($2::bytea), 'hex')"
	if err := pool.QueryRow(context.Background(), query, username, password).Scan(&id); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		}
		return -1
	} else {
		return
	}
}

func ClosePool() {
	pool.Close()
}
