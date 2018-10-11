import React from 'react'
import socketIOClient from "socket.io-client";
import './mazeLobby.css'
import ReactLoading from 'react-loading';

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
        <h2><b>Number of players in the lobby:{this.state.lobby.length}</b></h2>
        {this.state.firstPlayer && this.state.lobby.length > 0 // TODO ::: CHANGE THIS LINE WHEN WE RELEASE THE GAME!!!
          ? <div id={"side-by-side"}>
              <button onClick={() => this.startGame()} className="green">Start Game</button>
            <button onClick={() => this.leaveLobby()} className="red">Leave Lobby</button>
          </div>
          : [
            <ReactLoading type={"spin"} color={"#4CAF50"} height={'20%'} width={'20%'} />,
            (this.state.firstPlayer
                ? <h2>Waiting for more players</h2>
                : <h2>Waiting until the first player starts the game...</h2>
            ),
            <button onClick={() => this.leaveLobby()} className="red">Leave Lobby</button>
          ]
        }
        <p>Ghost player in lobby?</p>
        <button onClick={() => this.clearLobby()} className="yellow ghost">Clear lobby</button>
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
    });
  }

  componentWillUnmount() {
    this.leaveLobby();
    this.socket.close()
  }

  leaveLobby() {
    this.socket.emit('playerLeftLobby', { mazeID: this.props.maze.id, player: this.props.player });
    this.props.parentState.setState({ currentLobby: null });
  }

  startGame() {
    this.socket.emit('playerStartedGame', this.props.maze)
  }

  clearLobby(){
    this.socket.emit('clearLobby', this.props.maze.id);
    this.props.parentState.setState({ currentLobby: null });
  }
}

export default MazeLobby
