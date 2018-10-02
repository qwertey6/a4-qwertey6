import React from 'react'

class SinglePlayerMaze extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <p>The maze for MazeID:{this.props.maze.id} ({this.props.maze.name}) should go here for a single user to play</p>
    )
  }
}

export default SinglePlayerMaze
