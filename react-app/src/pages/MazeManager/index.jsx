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
    this.createNewMaze = this.createNewMaze.bind(this)
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
        <tr key={maze.id} onClick={() => this.editMaze(maze)}>
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
          <button onClick={this.createNewMaze}>Create a new Maze</button>
        </div>
        {this.state.selectedMazeToEdit != null
          ? <MazeEditor maze={this.state.selectedMazeToEdit} parentThis={this}/>
          : null
        }
      </div>
    );
  }

  createNewMaze() {
    let newMazeName = prompt("New maze's name?");
    const requestBody = {
      name: newMazeName
    };
    const _this = this;
    axios.post('/mazes/', requestBody)
      .then(res => {
        axios.get(`/mazes/${res.data.id}`)
          .then(res => {
            _this.loadAllMazes(res.data);
          }).catch(e => {
            console.log("ERROR", e)
        })
      }).catch(e => {
        console.log("ERROR", e)
    })
  }

  editMaze(maze) {
    this.setState({
      selectedMazeToEdit: maze
    });
  }
}

export default MazeManager
