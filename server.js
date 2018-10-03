const server = require('express')();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const port = 8080;

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Log each request made to the server in the terminal
server.use(function(req, res, next) {
  const timestamp = new Date();
  console.log('%s-%s: %s %s %s',
    timestamp.toLocaleDateString(),
    timestamp.toLocaleTimeString(),
    req.method,
    req.originalUrl,
    req.method === "GET" ? JSON.stringify(req.query) : JSON.stringify(req.params)
  );
  next();
});

// Database shizz
const db = new sqlite3.Database('./Mazes.db');
const create_table = `CREATE TABLE IF NOT EXISTS 'mazes' (
  id TEXT PRIMARY KEY,
  maze nchar(256),
  name nchar(256)
);
INSERT INTO 'mazes' (id,name,maze) VALUES (123, "ExampleMaze","WWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBW");`;
db.run(create_table, (err, row) => {
  if (err) {
    throw err;
  }
});

// Routes in the ./server-routes directory
server.use('/mazes', require('./server-routes/mazes'));
server.use('/multi-player', require('./server-routes/multi-player'));

server.listen(process.env.PORT || port, () => {
  console.log(`listening on ${process.env.PORT || port}`);
});