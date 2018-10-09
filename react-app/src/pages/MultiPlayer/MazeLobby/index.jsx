import React from 'react'
import socketIOClient from "socket.io-client";
import './mazeLobby.css'
import MultiPlayerMaze from "../MultiPlayerMaze";

class MazeLobby extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lobby: [],
      game: null
    };
    this.leaveLobby = this.leaveLobby.bind(this)
  }

  render() {
    return (
      <div id="maze-lobby">
        <button onClick={() => this.leaveLobby()}>Leave Lobby</button>
        <h2>Number of players in the lobby: {this.state.lobby.length}</h2>
        {this.state.firstPlayer
          ? <button onClick={() => this.startGame()}>Start Game</button>
          : <h2>Waiting until player1 starts the game...</h2>
        }
      </div>
    );
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);
    this.socket.on("mazeLobbies", mazeLobbies => {
      for (let mazeID in mazeLobbies){
        if (parseInt(mazeID) === this.props.maze.id){
          if (mazeLobbies[mazeID].length === 0){
            return // This only happens to the players immediately after player1 started the game
          }
          const firstPlayer = (mazeLobbies[mazeID][0].id === this.props.player.id);
          this.setState({
            lobby: mazeLobbies[mazeID],
            firstPlayer: firstPlayer
          });
        }
      }
    });
    this.socket.on("gameStart", game => {
      console.log(game);
      if (parseInt(game.maze.id) === this.props.maze.id) {
        this.props.parentState.setState({ currentGame: game })
      }
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  leaveLobby() {
    this.socket.emit('playerLeftLobby', { mazeID: this.props.maze.id, player: this.props.player });
    this.props.parentState.setState({ currentLobby: null })
  }

  startGame() {
    this.socket.emit('playerStartedGame', this.props.maze)
  }
}

export default MazeLobby
