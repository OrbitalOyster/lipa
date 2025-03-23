import mysql from 'mysql'

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'INSERT_DB_USER',
  password : 'INSERT_DB_PASSWORD',
  database : 'INSERT_DB_NAME'
});

connection.connect((err) => console.log({err}))

export const orgs = async (context: Context) => {
  connection.query("SELECT * FROM orgs", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
  return context.json({orgs: 'hello'})
}
