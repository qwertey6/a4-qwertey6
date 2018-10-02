import React from 'react'
import axios from 'axios'
import EditableMaze from "./EditableMaze/index";

class MazeEditor extends React.Component {
  constructor(props){
    super(props);
    this.saveEditableMaze = this.saveEditableMaze.bind(this)
  }

  render() {
    if (this.props.maze == null){
      // The user is creating a new maze
      return (
        <div id="maze-creator">
          <h2>Create A New Maze</h2>
          <input type="text" id="new-maze-name" placeholder="Enter the name of your maze here..." />
          <EditableMaze />
          <button onClick={this.saveEditableMaze}>Save Maze</button>
        </div>
      )
    } else {
      //The user is editing a maze
      return (
        <div id="maze-creator">
          <h2>Editing {this.props.maze.name}</h2>
          <EditableMaze maze={this.props.maze}/>
          <button onClick={this.saveEditableMaze}>Save Maze</button>
        </div>
      )
    }
  }

  saveEditableMaze() {
    //TODO: Get the edited maze from <EditableMaze />
    const maze = this.props.maze; // For now it will just be set to the original
    //TODO: Make sure the maze has a name, and a start and end?
    axios.post('/maze', maze)
      .then(() => {
        console.log(`Successfully saved the maze ${maze.id}`)
      }).catch(e => {
        console.log("ERROR", e);
    })
  }
}

export default MazeEditor
