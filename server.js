const express = require('express');
const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const port = 8080;

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'react-app/build')));

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
  name nchar(256),
  high_score integer
);
INSERT INTO 'mazes' (id,name,maze,high_score) VALUES (123, "ExampleMaze","WWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBWBBBBBBBBBBBBBBBW",999999);`;
db.run(create_table, (err, row) => {
  if (err) {
    throw err;
  }
});

// Routes in the ./server-routes directory
server.use('/mazes', require('./server-routes/mazes'));

// Anything else, send the index.html
server.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname + '/react-app/build/index.html'));
});

/**********************LOBBIES***************************/
let mazeLobbies = {}; // Key = mazeID, Value = list of player objects that are in that maze's lobby
let usersConnected = 0;
io.on('connection', (socket) => {
  usersConnected += 1;
  console.log('Users connected:' + usersConnected);
  socket.on("disconnect", () => {
    usersConnected -= 1;
  });
  socket.on("playerJoinLobby", (data) => {
    const mazeID = data.mazeID;
    const player = data.player;
    if (mazeLobbies[mazeID] == null) {
      let lobby = [];
      lobby.push(player);
      mazeLobbies[mazeID] = lobby
    } else {
      mazeLobbies[mazeID].push(player)
    }
  })
});

setInterval(function() {
  let listOfLobbyObjects = [];
  Object.keys(mazeLobbies).forEach(key => {
    console.log(key)
    listOfLobbyObjects.push({
      mazeID: key,
      lobby: mazeLobbies[key]
    })
  });
  io.sockets.emit("playerConnection", usersConnected);
  io.sockets.emit("mazeLobbies", listOfLobbyObjects)

  ;
}, 1000 / 60);
/********************END LOBBIES*************************/

http.listen(process.env.PORT || port, () => {
  console.log(`listening on ${process.env.PORT || port}`);
});