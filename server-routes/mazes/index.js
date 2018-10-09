const routes = require('express').Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Mazes.db');

/*
var seed = 1;
function random() {
    seed += 1;
    let x = Math.abs(Math.sin(seed++) * 10000);
    return x - Math.floor(x);
}*/
    /****************MAZE GENERATION*********************/
  function makeMaze(){
  var moves = [
    [ 0,  1],
    [ 0, -1],
    [ 1,  0],
    [-1,  0]];
  var width = 16;
  var height = 16;
  var mazeArray = [];
  var visited = {};//a hash of strings
  var rand = function(){return Math.floor(Math.random()*16)%4};

  function pointHash(x, y){
    return x + ":" + y;
  }
  function visitPoint(x, y){
    visited[pointHash(x,y)] = 1;
  }
  function recurse(x, y){
    visitPoint(x, y);
    let start = rand();
    for(let z=0; z < 4; z++) {
      let delta = moves[(start+z)%4];
      let x2 = x + delta[0];
      let y2 = y + delta[1];
      
      let nextX = x + delta[0]*2;
      let nextY = y + delta[1]*2;

      if( nextY < height && nextX < width && nextX >= 0 && nextY >= 0 && !visited[pointHash(nextX, nextY)]) {
        mazeArray[nextX][nextY] = "W";
        mazeArray[x2][y2] = "W";
        recurse(nextX, nextY);
      }
    }
  }
  function generateMaze(){
    for(let x=0; x<width; x++){
      mazeArray.push([]);
      for (let y=0; y<height; y++) {
        mazeArray[mazeArray.length-1].push("B");
      }
    }
    //recurse(0, 0);
    recurse(width-8,height-8);
    mazeArray[width-8][height-8] = "W";
    mazeArray[width-1][height-1] = "W";
    mazeArray[width-1][height-2] = "W"; 
    return [].concat.apply([], mazeArray).join("");
  }
return generateMaze();
}
/****************END MAZE GENERATION*********************/

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
  db.run(`INSERT INTO 'mazes' (id, name, maze, high_score) VALUES ("${id}", "${name}", "${makeMaze()}", "${999999}")`, [], (err) => {
    if (err) {
      console.log(err);
      res.status(400).end()
    } else {
      res.status(200).json({id: id})
    }
  });
});

// Input body: maze, or highScore
// Input param: id
// Output: 204 if updated, 400 else
routes.put('/:id', function(req, res) {
  const idToUpdate = req.params.id;
  const updatedMaze = req.body.maze;
  const updatedHighScore = req.body.highScore;
  let sqlStatement = '';
  if (updatedMaze != null) {
    sqlStatement = `UPDATE 'mazes' SET maze="${updatedMaze}" WHERE id="${idToUpdate}"`
  } else if (updatedHighScore != null){
    sqlStatement = `UPDATE 'mazes' SET high_score="${updatedHighScore}" WHERE id="${idToUpdate}"`
  }
  db.run(sqlStatement, [], (err, row) => {
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