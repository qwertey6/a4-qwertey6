import React from 'react'
import axios from 'axios'
import SinglePlayerMaze from "./SinglePlayerMaze/index";

import './singlePlayer.css'

class SinglePlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mazes: [],
      selectedMazeToPlay: null
    };
    this.playMaze = this.playMaze.bind(this)
  }

  componentWillMount() {
    const _this = this;
    axios.get('/Mazes.json')
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
      mazeButtons.push(<tr onClick={() => this.playMaze(maze)}><td>{maze.name}</td></tr>)
    });
    return mazeButtons
  }

  render() {
    return (
      <div id="single-player">
        <div id="maze-selector">
          <h2>Select a maze to Play:</h2>
          <table id="mazes-to-play">
            {this.displayMazes()}
          </table>
        </div>
        <div id="playable-maze">
          {this.state.selectedMazeToPlay != null
            ? [
              <h2>{this.state.selectedMazeToPlay.name}</h2>,
              <SinglePlayerMaze maze={this.state.selectedMazeToPlay}/>
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

export default SinglePlayer
