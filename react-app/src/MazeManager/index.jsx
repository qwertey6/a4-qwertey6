import React from 'react'
import axios from 'axios'
import './mazeManager.css'

class MazeEditor extends React.Component {
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
    let mazeButtons = [
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>,
      <tr><td>1</td></tr>
    ];
    this.state.mazes.forEach( maze => {
      mazeButtons.push(<tr onClick={() => this.editMaze(maze)}><td>{maze.name}</td></tr>)
    });
    return mazeButtons
  }

  render() {
    return (
      <div id="maze-editor">
        <div id="maze-picker">
          <h2>Edit a Maze:</h2>
          <table id="mazes-to-edit">
            {this.displayMazes()}
          </table>
          <button onClick={() => this.setState({selectedMazeToEdit: null})}>Create a new Maze</button>
        </div>
        <div id="maze-creator">
          {this.state.selectedMazeToEdit == null
            ? <input type="text" id="new-maze-name" placeholder="Enter the name of your maze here..." />
            : <h2>Editing {this.state.selectedMazeToEdit.name}</h2>
          }
          <p>Maze SVG should be here</p>
          <button>Save Maze</button>
        </div>
      </div>
    );
  }

  editMaze(maze) {
    this.setState({
      selectedMazeToEdit: maze
    });

    axios.get(`/getMaze?id=${maze.id}`)
      .then(res => {
        console.log(res.data)
      })
  }


}

export default MazeEditor
