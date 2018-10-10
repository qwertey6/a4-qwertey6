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
            <td id={`${maze.id}_lobbySize`}>0</td>
            <td>{maze.high_score == null ? "N/A" : maze.high_score}</td>
          </tr>
        )
      });
    }
    return (
      <table>
        <thead><tr><th>Name</th><th># Players waiting in Lobby</th><th>High Score</th></tr></thead>
        <tbody>{mazeButtons}</tbody>
      </table>
    )
  }

  render() {
    return (
      <div id="maze-lobby-selector">
        <h2>Join a maze's lobby:</h2>
        <div id="maze-lobbys-to-join">
          {this.displayMazes()}
          {this.state.selectedMaze != null
            ?
            <div>
              SVG OF SELECTED MAZE GOES HERE
            </div>
            : null
          }
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
    this.socket = socketIOClient(endpoint);
    this.socket.emit('pingMazeLobbies');
    this.socket.on("mazeLobbies", data => {
      // Update each maze's lobby size
      for (let mazeID in data){
        const mazeRowInTable = document.getElementById(`${mazeID}_lobbySize`);
        if (mazeRowInTable != null){
          mazeRowInTable.innerText = data[mazeID].length
        }
      }
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  joinLobby(){
    this.props.parentState.setState({ currentLobby: this.state.selectedMaze })
  }
}

export default MazeLobbySelector
