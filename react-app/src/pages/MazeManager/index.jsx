import React from 'react'
import axios from 'axios'
import MazeEditor from "./MazeEditor";
import './mazeManager.css'

class MazeManager extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mazes: [],
      selectedMazeToEdit: null
    };
  }

  componentWillMount() {
    this.loadAllMazes()
  }

  loadAllMazes(optionalSelectedMaze) {
    const _this = this;
    axios.get('/mazes')
      .then(res => {
        const selectedMaze = optionalSelectedMaze != null ? optionalSelectedMaze : res.data[0];
        _this.setState({
          mazes: res.data,
          selectedMazeToEdit: selectedMaze
        })
      })
  }

  displayMazes() {
    const getMazeClass = (id) => {
      if (this.state.selectedMazeToEdit != null &&
        this.state.selectedMazeToEdit.id === id){
        return "selected"
      } else return null
    };

    let mazeButtons = [];
    this.state.mazes.forEach( maze => {
      mazeButtons.push(
        <tr key={maze.id} onClick={() => this.selectMaze(maze)}>
          <td className={getMazeClass(maze.id)}>{maze.name}</td>
        </tr>)
    });
    return mazeButtons
  }

  render() {
    return (
      <div id="maze-editor">
        <div id="maze-picker">
          <h2>Select a maze to Edit:</h2>
          <table id="mazes-to-edit">
            <tbody>
              {this.displayMazes()}
            </tbody>
          </table>
        </div>
        {this.state.selectedMazeToEdit != null
          ? <MazeEditor maze={this.state.selectedMazeToEdit} parentThis={this}/>
          : null
        }
      </div>
    );
  }

  selectMaze(maze) {
    const _this = this;
    sessionStorage.setItem('boardState', null);
    axios.get(`/mazes/${maze.id}`)
      .then(res => {
        _this.setState({ selectedMazeToEdit: res.data })
      })
  }
}

export default MazeManager
