import React from 'react'
import axios from 'axios'
import EditableMaze from "./EditableMaze/index";
import { NotificationManager } from 'react-notifications';

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
    if (newMazeName.length > 15){
      NotificationManager.error('Maze name cannot exceed 15 characters');
      return;
    }
    const requestBody = {
      name: newMazeName
    };
    const _this = this;
    axios.post('/mazes/', requestBody)
      .then(res => {
        axios.get(`/mazes/${res.data.id}`)
          .then(res => {
            _this.props.parentThis.loadAllMazes();
            NotificationManager.success(`Created the maze ${newMazeName}`);
          }).catch(e => {
          console.log("ERROR", e)
        })
      }).catch(e => {
      console.log("ERROR", e)
    })
  }

  saveEditableMaze() {
    if (sessionStorage.getItem('boardState') == null){
      NotificationManager.success(`The maze ${this.props.maze.name} has been saved`)
      return
    }

    let requestBody = {
      maze: sessionStorage.getItem('boardState')
    };

    //TODO: Make sure the maze has a start and end?
    const _this = this;
    axios.put(`/mazes/${this.props.maze.id}`, requestBody)
      .then(() => {
        NotificationManager.success(`The maze ${_this.props.maze.name} has been saved`);
        _this.props.parentThis.loadAllMazes()
      }).catch(e => {
        console.log("ERROR", e);
    })
  }

  deleteMaze() {
    if (this.props.numberOfMazes === 1){
      NotificationManager.warning(`You cannot delete the last maze`);
      return;
    }
    const _this = this;
    axios.delete(`/mazes/${_this.props.maze.id}`)
      .then(res => {
        NotificationManager.success(`Deleted the maze ${_this.props.maze.name}`);
        _this.props.parentThis.loadAllMazes()
      }).catch(e => {
        console.log("ERROR", e)
    })
  }
}

export default MazeEditor
