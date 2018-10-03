import React from 'react'

class EditableMaze extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return <svg id={this.props.maze.id} className="EditableMaze" width="100%" height="100%" ></svg>
  }
  componentDidMount(){
    let script = document.createElement('script');
    script.src = require("./Maze.js");
    document.getElementsByTagName('body')[0].appendChild(script);
  }
}

export default EditableMaze
