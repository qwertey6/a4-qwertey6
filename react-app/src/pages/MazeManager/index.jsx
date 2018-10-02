import React from 'react'
import axios from 'axios'
import './mazeManager.css'
import MazeEditor from "./MazeEditor";

class MazeManager extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mazes: [],
      selectedMazeToEdit: null
    }
  }

  componentWillMount() {
    const _this = this;
    axios.get('/Mazes.json')
      .then(res => {
        _this.setState({ mazes: res.data })
      })
  }

  displayMazes() {
    let mazeButtons = [];
    this.state.mazes.forEach( maze => {
      mazeButtons.push(<tr onClick={() => this.editMaze(maze)}><td>{maze.name}</td></tr>)
    });
    return mazeButtons
  }

  render() {
    return (
      <div id="maze-editor">
        <div id="maze-picker">
          <h2>Select a maze to Edit:</h2>
          <table id="mazes-to-edit">
            {this.displayMazes()}
          </table>
          {this.state.selectedMazeToEdit != null
            ? <button onClick={() => this.setState({selectedMazeToEdit: null})}>Create a new Maze</button>
            : null
          }
        </div>
        <MazeEditor maze={this.state.selectedMazeToEdit}/>
      </div>
    );
  }

  editMaze(maze) {
    this.setState({
      selectedMazeToEdit: maze
    });
  }
}

export default MazeManager
