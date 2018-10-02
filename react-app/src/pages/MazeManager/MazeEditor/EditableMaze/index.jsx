import React from 'react'

class EditableMaze extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      // this.props.maze is the maze being edited. It was given to <EditableMaze /> by <MazeEditor />
      (this.props.maze == null
        ? <p>A Blank Maze SVG should go here for the user to create</p>
        : <p>The maze for MazeID:{this.props.maze.id} ({this.props.maze.name}) should go here for the user to edit</p>
      )
    )
  }
}

export default EditableMaze
