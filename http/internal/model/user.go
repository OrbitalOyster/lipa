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

func UserLogin(pool *pgxpool.Pool, login string, password string) (User, bool) {
	const query = `
		SELECT id, name, login
		FROM lipa.users
		WHERE login = $1 AND password_hash = encode(sha256($2::bytea), 'hex')`
	rows, _ := pool.Query(context.Background(), query, login, password)
	if result, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[User]); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		} else {
			return result, false
		}
	} else {
		return result, true
	}
}
