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

type Org struct {
	Id   int    `db:"id"`
	Name string `db:"name"`
}

func GetAllOrgs() []Org {
	const query = "SELECT id, name FROM lipa.orgs"
	if rows, err := pool.Query(context.Background(), query); err != nil {
		panic(err)
	} else {
		orgs, err := pgx.CollectRows(rows, pgx.RowToStructByName[Org])
		if err != nil {
			panic(err)
		}
		return orgs
	}
}

func ClosePool() {
	pool.Close()
}
