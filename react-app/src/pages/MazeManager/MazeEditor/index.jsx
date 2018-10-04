import React from 'react'
import axios from 'axios'
import EditableMaze from "./EditableMaze/index";

class MazeEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      newlyEditedMaze: this.props.maze.maze
    };
    this.createNewMaze = this.createNewMaze.bind(this);
    this.saveEditableMaze = this.saveEditableMaze.bind(this);
    this.deleteMaze = this.deleteMaze.bind(this)
  }

  render() {
    return (
      <div id="maze-creator">
        <h2>Edit {this.props.maze.name}</h2>
        <EditableMaze maze={this.props.maze} parentState={this}/>
        <div id="edit-maze-buttons">
          <button onClick={this.createNewMaze} className="blue">Create a new Maze</button>
          <button onClick={this.saveEditableMaze} className="green">Save Maze</button>
          <button onClick={this.deleteMaze} className="red">Delete Maze</button>
        </div>
      </div>
    )
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

  saveEditableMaze() {
    let requestBody = {
      maze: this.state.newlyEditedMaze
    };

    //TODO: Make sure the maze has a start and end?
    axios.put(`/mazes/${this.props.maze.id}`, requestBody)
      .then(() => {
        console.log(`Successfully saved the maze ${this.props.maze.id}`)
      }).catch(e => {
        console.log("ERROR", e);
    })
  }

  deleteMaze() {
    const _this = this;
    axios.delete(`/mazes/${_this.props.maze.id}`)
      .then(res => {
        _this.props.parentThis.loadAllMazes()
      }).catch(e => {
        console.log("ERROR", e)
    })
  }
}

export default MazeEditor
