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
    console.log(this.state.lobby)
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
    this.socket.emit('playerJoinedLobby', { mazeID: this.props.maze.id, player: this.props.player });
    this.socket.on("mazeLobbies", mazeLobbies => {
      for (let mazeID in mazeLobbies){
        console.log(mazeID, this.props.maze.id)
        if (mazeID === this.props.maze.id){
          console.log(mazeLobbies[mazeID]);
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
    this.socket.on(`gameStart-${this.props.maze.id}`, game => {
      document.getElementById('maze-lobby').innerHTML = "<h1>3</h1>";
      setTimeout(() => {
        document.getElementById('maze-lobby').innerHTML = "<h1>2</h1>";
        setTimeout(() => {
          document.getElementById('maze-lobby').innerHTML = "<h1>1</h1>";
          setTimeout(() => {
            this.props.parentState.setState({ currentGame: game })
          }, 1000);
        }, 1000);
      }, 1000);
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  leaveLobby() {
    this.props.parentState.setState({ currentLobby: null })
    this.socket.emit('playerLeftLobby', { mazeID: this.props.maze.id, player: this.props.player });
  }

  startGame() {
    this.socket.emit('playerStartedGame', this.props.maze)
  }
}

export default MazeLobby
