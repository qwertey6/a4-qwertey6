import React from 'react'
import axios from 'axios'
import MultiPlayerMaze from "./MultiPlayerMaze/index";

import './multiPlayer.css'

class MultiPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mazes: [],
      selectedMazeToPlay: null
    };
    this.playMaze = this.playMaze.bind(this);
  }

  componentWillMount() {
    const _this = this;
    axios.get('/mazes')
      .then(res => {
        _this.setState({
          mazes: res.data,
          selectedMazeToPlay: res.data[0]
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
        <div id="maze-selector">
          <h2>Select a maze to Play:</h2>
          <div id="mazes-to-play">
            {this.displayMazes()}
          </div>
        </div>
        <div id="playable-maze">
          {this.state.selectedMazeToPlay != null
            ? [
              <h2 key={1}>{this.state.selectedMazeToPlay.name}</h2>,
              <MultiPlayerMaze key={2} maze={this.state.selectedMazeToPlay}/>
            ]
            : null
          }
        </div>
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
