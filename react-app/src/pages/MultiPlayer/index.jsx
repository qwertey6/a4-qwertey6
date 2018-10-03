import React from 'react'
import axios from 'axios'

class MultiPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      game: null
    }
  }

  componentDidMount(){
    const _this = this;
    axios.post('/multi-player/add-player', this.props.player)
      .then(res => {
        _this.setState({ game: res.data })
      })
  }

  getOtherPlayer() {
    return (
      this.state.game.player1.userID === this.props.player.userID
        ? this.state.game.player2
        : this.state.game.player1
    )
  }

  render() {
    return (
      this.state.game == null
        ? <h2>Searching for a second player...</h2>
        :
        <div id="multiplayer">
          <p>You are playing against {this.getOtherPlayer().username}</p>
        </div>
    );
  }
}

export default MultiPlayer
