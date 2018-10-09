import React from 'react'
import axios from 'axios'
import MazeLobbySelector from "./MazeLobbySelector";
import MazeLobby from "./MazeLobby";

import './multiPlayer.css'

class MultiPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentLobby: null
    };
  }

  componentWillMount() {
    const _this = this;
    axios.get('/mazes')
      .then(res => {
        _this.setState({
          mazes: res.data
        })
      })
  }

  render() {
    return (
      <div id="multi-player">
        {this.state.currentLobby == null
          ? <MazeLobbySelector parentState={this} player={this.props.player}/>
          : <MazeLobby parentState={this} maze={this.state.currentLobby} player={this.props.player} />
        }
      </div>
    );
  }
}

export default MultiPlayer
