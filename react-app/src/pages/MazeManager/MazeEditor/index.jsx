import React from 'react'
import axios from 'axios'
import EditableMaze from "./EditableMaze/index";

class MazeEditor extends React.Component {
  constructor(props){
    super(props);
    this.saveEditableMaze = this.saveEditableMaze.bind(this);
    this.deleteMaze = this.deleteMaze.bind(this)
  }

  render() {
    return (
      <div id="maze-creator">
        <h2>Edit {this.props.maze.name}</h2>
        <EditableMaze maze={this.props.maze}/>
        <div id="edit-maze-buttons">
          <button onClick={this.saveEditableMaze} className="green">Save Maze</button>
          <button onClick={this.deleteMaze} className="red">Delete Maze</button>
        </div>
      </div>
    )
  }

  saveEditableMaze() {
    let requestBody = {
      maze: this.props.maze //TODO: Get the edited maze from <EditableMaze /> instead of the original
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
