import React from 'react'
import socketIOClient from "socket.io-client";
import './mazeLobby.css'

class MazeLobby extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lobby: []
    };
    this.leaveLobby = this.leaveLobby.bind(this)
  }

  render() {
    return (
      <div id="maze-lobby">
        <button onClick={() => this.leaveLobby()}>Leave Lobby</button>
        <h2>Number of players in the lobby: {this.state.lobby.length}</h2>
        {this.state.firstPlayer ? <button>Start Game</button> : null}
      </div>
    );
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);
    this.socket.on("mazeLobbies", mazeLobbies => {
      for (let mazeID in mazeLobbies){
        if (parseInt(mazeID) === this.props.maze.id){
          let firstPlayer = (mazeLobbies[mazeID].indexOf(this.props.player) === 0);
          this.setState({
            lobby: mazeLobbies[mazeID],
            firstPlayer: firstPlayer
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.socket.close()
  }

  leaveLobby() {
    this.socket.emit('playerLeftLobby', { mazeID: this.props.maze.id, player: this.props.player });
    this.props.parentState.setState({ currentLobby: null })
  }

}

export default MazeLobby
