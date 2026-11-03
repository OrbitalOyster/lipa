package model

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	Id    int    `db:"id"`
	Name  string `db:"name"`
	Login string `db:"login"`
}

func GetUser(pool *pgxpool.Pool, login string, password string) (result User, found bool) {
	const query = "SELECT id, name, login FROM lipa.users WHERE login = $1 AND password_hash = encode(sha256($2::bytea), 'hex')"
	if rows, err := pool.Query(context.Background(), query, login, password); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		} else {
			return result, false
		}
	} else {
		result, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[User])
		if err != nil {
			panic(err)
		}
		return result, true
	}
}
