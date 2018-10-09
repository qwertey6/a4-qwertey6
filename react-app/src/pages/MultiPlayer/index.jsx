import React from 'react'
import axios from 'axios'
import MazeLobbySelector from "./MazeLobbySelector";
import MazeLobby from "./MazeLobby";

import './multiPlayer.css'
import MultiPlayerMaze from "./MultiPlayerMaze";

class MultiPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentLobby: null,
      currentGame: null
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
          : (this.state.currentGame == null
              ? <MazeLobby parentState={this} maze={this.state.currentLobby} player={this.props.player}/>
              : <MultiPlayerMaze game={this.state.currentGame} parentState={this} player={this.props.player}/>
          )
        }
      </div>
    );
  }
}

export default MultiPlayer
