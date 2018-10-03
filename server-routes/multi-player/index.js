const routes = require('express').Router();

let game = {
  player1: null,
  player2: null
};

routes.post('/add-player', function(req, res) {
  console.log(req.body);
  // Bad potential race case here, but whatever
  if (game.player1 != null){
    game.player2 = req.body;
    res.json(game)
  } else {
    game.player1 = req.body;
    while (1){
      if (game.player2 != null) {
        res.json(game)
      }
    }
  }
});

console.log("POST\t/multi-player/add-player");

module.exports = routes;