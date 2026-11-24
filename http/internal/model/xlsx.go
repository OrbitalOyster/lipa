package model

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type XLSX struct {
	Filename string    `db:"filename"`
	Hash     string    `db:"hash"`
	Uploaded time.Time `db:"uploaded"`
}

func GetXLSXs(pool *pgxpool.Pool) []XLSX {
	const query = `
		SELECT filename, hash, uploaded
		FROM lipa.xlsx`
	rows, _ := pool.Query(
		context.Background(),
		query,
	)
	if result, err := pgx.CollectRows(rows, pgx.RowToStructByName[XLSX]); err != nil && err != pgx.ErrNoRows {
		panic(err)
	} else {
		return result
	}
}
