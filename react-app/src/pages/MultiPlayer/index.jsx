import React from 'react'
import axios from 'axios'
import MazeLobbySelector from "./MazeLobbySelector";
import MazeLobby from "./MazeLobby";

import './multiPlayer.css'

class MultiPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentLobby: null
    };
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
    this.state.mazes.forEach( maze => {
      mazeButtons.push(
        <button key={maze.id}
                onClick={() => this.playMaze(maze)}
                className={this.state.selectedMazeToPlay.id === maze.id ? "selected" : null}
        >{maze.name}
        </button>
      )
    });
    return mazeButtons
  }

  render() {
    return (
      <div id="multi-player">
        {this.state.currentLobby == null
          ? <MazeLobbySelector parentState={this} player={this.props.player}/>
          : <MazeLobby maze={this.state.currentLobby} />
        }
      </div>
    );
  }

  playMaze(maze){
    this.setState({
      selectedMazeToPlay: maze
    })
  }
}

export default MultiPlayer
