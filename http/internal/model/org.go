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

func GetOrg(pool *pgxpool.Pool, orgId string, password string) (id int, name string) {
	const query = "SELECT id, name FROM lipa.orgs WHERE id = $1 AND password_hash = encode(sha256($2::bytea), 'hex')"
	if err := pool.QueryRow(context.Background(), query, orgId, password).Scan(&id, &name); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		}
		return -1, ""
	} else {
		return
	}
}
