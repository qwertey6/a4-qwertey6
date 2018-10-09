import React from 'react'
import socketIOClient from "socket.io-client";
import './multiPlayerMaze.css'

class MultiPlayerMaze extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.game);
    return (
      <div id="multi-player-maze" >
        <h2>Maze Being played: {this.props.game.maze.id} ({this.props.game.maze.name})</h2>
        <h2>Users in this game:</h2>
        {this.getPlayers()}
        <button onClick={() => this.leaveGame()}>Leave Game</button>
      </div>
    )
  }

  getPlayers() {
    let players = [];
    this.props.game.players.forEach(player => {
      players.push(<p>Username: {player.username}, ID: {player.id}, Avatar: {player.avatar}, Ability: {player.ability}</p>)
    });
    return players
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);
  }

  leaveGame() {
    this.props.parentState.setState({
      currentLobby: null,
      currentGame: null
    })
  }

}

export default MultiPlayerMaze
