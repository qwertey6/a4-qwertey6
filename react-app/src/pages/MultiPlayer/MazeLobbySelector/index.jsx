import React from 'react'
import axios from 'axios'
import socketIOClient from "socket.io-client";
import './mazeLobbySelector.css'
import * as d3 from "d3";

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

  componentDidUpdate(){
    if (this.state.selectedMaze != null){
      this.viewSelectedMaze()
    }
  }

  displayMazes() {
    let mazeButtons = [];
    if (this.state.mazes.length > 0){
      this.state.mazes.forEach( maze => {
        mazeButtons.push(
          <tr key={maze.id} onClick={() => this.setState({ selectedMaze: maze })}>
            <td>{maze.name}</td>
            <td id={`${maze.id}_lobbySize`}>0</td>
            <td>{maze.high_score == null ? "N/A" : `${Math.trunc(maze.high_score / 1000)}.${maze.high_score % 1000}s`}</td>
          </tr>
        )
      });
    }
    return (
      <table id="lobbies">
        <thead><tr><th>Name</th><th># Players in Lobby</th><th>High Score</th></tr></thead>
        <tbody>{mazeButtons}</tbody>
      </table>
    )
  }

  render() {
    return (
      <div id="maze-lobby-selector" align="center">
        <div id="maze-lobbys-to-join" align="center">
          <div id="selector">
            <h2>Join a maze's lobby:</h2>
            {this.displayMazes()}
          </div>
          {this.state.selectedMaze != null
            ?
            <div id="selected-maze-svg" align="center">
              <h2>{this.state.selectedMaze.name}</h2>
              <svg className="viewableMaze"></svg>
            </div>
            : null
          }
        </div>
        {this.state.selectedMaze != null
          ? <button onClick={() => this.joinLobby()} className="blue">Join {this.state.selectedMaze.name}'s Lobby</button>
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
    if (this.state.selectedMaze != null){
      this.viewSelectedMaze()
    }
  }

  componentWillUnmount() {
    this.socket.close()
  }

  joinLobby(){
    this.props.parentState.setState({ currentLobby: this.state.selectedMaze })
  }

  viewSelectedMaze(){
    var width  = 100;
    var height = 100;
    var h = height/16;//tile height
    var w = width/16;

    var board = d3.select("svg").append("g").attr("class","board");

    axios.get('/mazes/'+this.state.selectedMaze.id)
      .then(res => {
        var data = res.data;

        for(var i=0; i<16; i++){//load columns
          for(var j=0; j<16; j++){//load rows
            let tile = data.maze[16*i + j];

            board.append("rect")
              .data([{x:j, y:i, state:tile, health:1, slimed:false}])
              .attr("width", w+"%")
              .attr("height", h+"%")
              .attr("x", (w*j) +"%")
              .attr("y", (h*i) +"%")
              .attr("class", tile)
          }
        }
      })
  }
}

export default MazeLobbySelector
