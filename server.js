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
let activeGames = []; // List of game objects
io.on('connection', (socket) => {
  socket.on("playerJoinedLobby", (data) => {
    const mazeID = data.mazeID;
    const player = data.player;
    if (mazeLobbies[mazeID] == null) {
      let lobby = [];
      lobby.push(player);
      mazeLobbies[mazeID] = lobby
    } else {
      mazeLobbies[mazeID].push(player)
    }
    io.sockets.emit("mazeLobbies", mazeLobbies);
  });
  socket.on('playerLeftLobby', (data) => {
    const mazeID = data.mazeID;
    const player = data.player;
    mazeLobbies[mazeID].splice(mazeLobbies[mazeID].indexOf(player), 1);
    io.sockets.emit("mazeLobbies", mazeLobbies);
  });
  socket.on('playerStartedGame', (maze) => {
    console.log("Player started game!");
    const players = [];
    mazeLobbies[maze.id].forEach(player => {
      player.x = 0;
      player.y = 0;
      player.dx = 0;
      player.dy = 0;
      player.update = false;
      player.use_ability = false;
      player.tail = [];
      players.push(player)
    });
    const game = {
      maze: maze,
      players: players,
      id: Date.now().toString(36),
      start: Math.floor(new Date() / 1000)
    };
    activeGames.push(game);
    io.sockets.emit(`gameStart-${maze.id}`, game);
    mazeLobbies[maze.id] = []; // Clear the lobby for this maze
    io.sockets.emit("mazeLobbies", mazeLobbies);
  });
  socket.on('playerMove', (game, updatedPlayer) => {
    console.log("PLAYER MOVED");
    for (let i = 0; i < activeGames.length; i++){
      if (activeGames[i].id === game.id){
        if (updatedPlayer.x === 15 && updatedPlayer.y === 15){
          activeGames.splice(i, 1); // Remove the game from the list of active games
          const time = Math.floor(new Date() / 1000) - game.start;
          const results = {
            time: time,
            player: updatedPlayer
          };
          io.sockets.emit(`mazeWinner-${game.id}`, results);
          if (time < game.maze.high_score){
            db.run(`UPDATE 'mazes' SET high_score="${time}" WHERE id="${game.maze.id}"`, [], (err, row) => {})
          }
          break;
        }
        activeGames[i].players.map(player => {
          if (player.id === updatedPlayer.id){
            console.log("ORIGINAL:", player);
            console.log("UPDATED:", updatedPlayer);
            return updatedPlayer
          } else {
            return player
          }
        });
        io.sockets.emit(`gameTick-${game.id}`, activeGames[i]);
        break
      }
    }
  });
  // Needed for one case where the client needs to get just the maze lobbies
  socket.on('pingMazeLobbies', () => {
    io.sockets.emit("mazeLobbies", mazeLobbies);
  })
});

/********************END LOBBIES*************************/

http.listen(process.env.PORT || port, () => {
  console.log(`listening on ${process.env.PORT || port}`);
});