import React from 'react'
import socketIOClient from "socket.io-client";
import './mazeLobby.css'

class MazeLobby extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lobby: [],
      firstPlayer: false
    };
  }

  render() {
    return (
      <div id="maze-lobby">
        <h2>Number of players in the lobby: {this.state.lobby.length}</h2>
        {this.state.firstPlayer ? <button>Start Game</button> : null}
      </div>
    );
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("mazeLobbies", data => {
      data.forEach(mazeLobby => {
        if (mazeLobby.mazeID === this.props.maze.mazeID){
          const firstPlayer = mazeLobby.length === 1;
          this.setState({
            lobby: mazeLobby.lobby,
            firstPlayer: firstPlayer
          })
        }
      })
    });
  }

}

export default MazeLobby
