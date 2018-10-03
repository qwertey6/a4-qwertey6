const routes = require('express').Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Mazes.db');

// Output: A list of mazes if successful, 400 else
routes.get('/', function(req, res) {
  db.all(`SELECT * FROM 'mazes'`,[], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(400).send()
    } else {
      res.end(JSON.stringify(rows));
    }
  })
});

// Input params: id
// Output: A maze if successful, 404 else
routes.get('/:id', function(req, res) {
  const id = req.params.id;
  db.get(`SELECT * FROM 'mazes' WHERE id="${id}"`,[], (err, row) => {
    if (err) {
      console.log(err);
      res.status(404).send()
    } else {
      res.status(200).end(JSON.stringify(row));
    }
  })
});

// Input body: name
// Output: 204 if created, 400 else
routes.post('/', function(req, res) {
  const id = Math.floor((Math.random()*1412512)%10000);
  const name = req.body.name;
  if (name == null) {
    res.status(400).end("Missing name in body")
  }
  const default_maze = "WWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBW";
  db.run(`INSERT INTO 'mazes' (id, name, maze) VALUES ("${id}", "${name}", "${default_maze}")`, [], (err) => {
    if (err) {
      console.log(err);
      res.status(400).end()
    } else {
      res.status(200).json({id: id})
    }
  });
});

// Input body: maze
// Input param: id
// Output: 204 if updated, 400 else
routes.put('/:id', function(req, res) {
  const idToUpdate = req.params.id;
  const updatedMaze = req.body.maze;
  db.run(`UPDATE 'mazes' SET maze="${updatedMaze}" WHERE id="${idToUpdate}"`, [], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      res.status(204).end()
    }
  })
});

// Input param: id
// Output: 204 if successful, 404 else
routes.delete('/:id', function(req, res) {
  const id = req.params.id;
  db.run(`DELETE FROM 'mazes' WHERE id="${id}"`,[], (err, row) => {
    if (err) {
      console.log(err);
      res.status(404).send()
    } else {
      res.status(204).end();
    }
  });
});

console.log("GET \t/mazes");
console.log("GET \t/mazes/:id");
console.log("POST\t/mazes/");
console.log("PUT \t/mazes/:id");
console.log("DELETE\t/mazes/:id");

module.exports = routes;