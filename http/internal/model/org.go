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

func GetOrg(pool *pgxpool.Pool, id string, password string) (result Org, found bool) {
	const query = "SELECT id, name, ord FROM lipa.orgs WHERE id = $1 AND password_hash = encode(sha256($2::bytea), 'hex')"
	if rows, err := pool.Query(context.Background(), query, id, password); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		} else {
			return result, false
		}
	} else {
		result, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Org])
		if err != nil {
			panic(err)
		}
		return result, true
	}
}
