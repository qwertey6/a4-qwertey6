import React from 'react'
import axios from 'axios'

class MultiPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      game: null
    }
  }

  render() {
    return (
      <div id="multiplayer">
        <p>Multiplayer</p>
      </div>
    )
  }
}

export default MultiPlayer
