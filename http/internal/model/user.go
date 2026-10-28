package model

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetUserId(pool *pgxpool.Pool, username string, password string) (id int) {
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
