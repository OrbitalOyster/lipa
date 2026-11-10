package model

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Org struct {
	Id   int    `db:"id"`
	Name string `db:"name"`
	Ord  int    `db:"ord"`
}

func GetAllOrgs(pool *pgxpool.Pool) []Org {
	const query = "SELECT id, name, ord FROM lipa.orgs ORDER BY ord"
	rows, _ := pool.Query(context.Background(), query)
	if result, err := pgx.CollectRows(rows, pgx.RowToStructByName[Org]); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		} else {
			return result
		}
	} else {
		return result
	}
}

func GetOrg(pool *pgxpool.Pool, id string, password string) (Org, bool) {
	const query = "SELECT id, name, ord FROM lipa.orgs WHERE id = $1 AND password_hash = encode(sha256($2::bytea), 'hex')"
	rows, _ := pool.Query(context.Background(), query, id, password)
	if result, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Org]); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		} else {
			return result, false
		}
	} else {
		return result, true
	}
}
