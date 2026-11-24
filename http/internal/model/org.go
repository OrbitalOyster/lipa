package model

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Org struct {
	Id      int     `db:"id"`
	Name    string  `db:"name"`
	Address *string `db:"address"`
	Ord     int     `db:"ord"`
	Active  bool    `db:"active"`
}

func GetOrg(pool *pgxpool.Pool, id int) (Org, bool) {
	const query = `
		SELECT id, name, address, ord, active
		FROM lipa.orgs
		WHERE id = $1`
	rows, _ := pool.Query(
		context.Background(),
		query,
		id,
	)
	if result, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Org]); err != nil {
		if err != pgx.ErrNoRows {
			panic(err)
		} else {
			return result, false
		}
	} else {
		return result, true
	}
}

func GetOrgs(pool *pgxpool.Pool, filter string) []Org {
	const query = `
		SELECT id, name, address, ord, active
		FROM lipa.orgs
		WHERE name LIKE $1
		ORDER BY ord`
	rows, _ := pool.Query(
		context.Background(),
		query,
		"%"+filter+"%",
	)
	if result, err := pgx.CollectRows(rows, pgx.RowToStructByName[Org]); err != nil && err != pgx.ErrNoRows {
		panic(err)
	} else {
		return result
	}
}

func OrgLogin(pool *pgxpool.Pool, id string, password string) (Org, bool) {
	const query = `
		SELECT id, name, address, ord, active
		FROM lipa.orgs
		WHERE id = $1 AND password_hash = encode(sha256($2::bytea), 'hex')`
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
