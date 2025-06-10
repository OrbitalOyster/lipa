import mysql from 'mysql2/promise'

const user = Bun.env['DB_USER'],
  password = Bun.env['DB_PASSWORD'],
  port = Bun.env['DB_PORT'],
  db = Bun.env['DB_NAME'],
  host = Bun.env['DB_HOST'],
  uri = `mysql://${user}:${password}@${host}:${port}/${db}`

export default () => mysql.createConnection(uri)
