import React from 'react'
import axios from 'axios'
import socketIOClient from "socket.io-client";
import './mazeLobbySelector.css'

class MazeLobbySelector extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mazes: [],
      selectedMaze: null,
      playersConnected: 0
    };
    this.joinLobby = this.joinLobby.bind(this);
  }

  componentWillMount() {
    const _this = this;
    axios.get('/mazes')
      .then(res => {
        _this.setState({
          mazes: res.data
        })
      })
  }

  displayMazes() {
    let mazeButtons = [];
    if (this.state.mazes.length > 0){
      this.state.mazes.forEach( maze => {
        mazeButtons.push(
          <tr key={maze.id} onClick={() => this.setState({ selectedMaze: maze })}>
            <td>{maze.name}</td>
            <td id={maze.id + "_lobbySize"}>0</td>
            <td>{maze.high_score == null ? "N/A" : maze.high_score}</td>
          </tr>
        )
      });
    }
    return mazeButtons
  }

  render() {
    return (
      <div id="maze-lobby-selector">
        <h2>Number of Players connected: {this.state.playersConnected}</h2>
        <h2>Join a maze's lobby:</h2>
        <div id="maze-lobbys-to-join">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th># Players waiting in Lobby</th>
                <th>High Score</th>
              </tr>
            </thead>
            <tbody>
              {this.displayMazes()}
            </tbody>
          </table>
          <div>
            SVG OF SELECTED MAZE GOES HERE
          </div>
        </div>
        {this.state.selectedMaze != null
          ? <button onClick={() => this.joinLobby()}>Join {this.state.selectedMaze.name}'s Lobby</button>
          : null
        }
      </div>
    );
  }

  componentDidMount(){
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("mazeLobbies", data => {
      data.forEach(mazeLobby => {
        document.getElementById(`${mazeLobby.mazeID}_lobbySize`).value = mazeLobby.lobby.length
      })
    });
    socket.on("playerConnectionUpdate", data => {
      this.setState({ playersConnected: data })
    })
  }

  joinLobby(){
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit('playerJoinLobby', { mazeID: this.state.selectedMaze, player: this.props.player });
    this.props.parentState.setState({ currentLobby: this.state.selectedMaze })
  }
}

export default MazeLobbySelector
