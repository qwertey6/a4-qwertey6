import React from 'react'
import { Link } from "react-router-dom";
import './signIn.css'

class Home extends React.Component {
  constructor(props){
    super(props);
    this.setUsername = this.setUsername.bind(this);
    this.setAvatar = this.setAvatar.bind(this);
    this.setAbility = this.setAbility.bind(this);
  }

  getAvatarClass(avatar){
    if (this.props.rootState.state.avatar === avatar){
      return "avatar selected"
    } else {
      return "avatar"
    }
  }

  getAbilityClass(ability){
    if (this.props.rootState.state.powerAbility === ability){
      return "ability selected"
    } else {
      return "ability"
    }
  }

  render() {
    const rootState = this.props.rootState.state;
    return (
      <div id="sign-in">
        <h2>Sign In</h2>
        <input type="text" id="username" onChange={this.setUsername} placeholder="Enter a username here..." defaultValue={this.props.rootState.state.username}/>
        <h2>Choose your avatar</h2>
        <div id="avatars">
          <img className={this.getAvatarClass("circle")} id="circle" onClick={() => this.setAvatar("circle")} src={require('../pictures/avatars/circle.png')} />
          <img className={this.getAvatarClass("square")} id="square" onClick={() => this.setAvatar("square")} src={require('../pictures/avatars/square.png')} />
          <img className={this.getAvatarClass("sun")} id="sun" onClick={() => this.setAvatar("sun")} src={require('../pictures/avatars/sun.png')} />
          <img className={this.getAvatarClass("triangle")} id="triangle" onClick={() => this.setAvatar("triangle")} src={require('../pictures/avatars/triangle.png')} />
          <img className={this.getAvatarClass("smile")} id="smile" onClick={() => this.setAvatar("smile")} src={require('../pictures/avatars/smile.png')} />
          <img className={this.getAvatarClass("star")} id="star" onClick={() => this.setAvatar("star")} src={require('../pictures/avatars/star.png')} />
        </div>
        <h2>Choose your power ability</h2>
        <div id="power-ability">
          <img className={this.getAbilityClass("dig")} id="dig" onClick={() => this.setAbility("dig")} src={require('../pictures/abilities/dig.png')} />
          <img className={this.getAbilityClass("invisibility")} id="invisibility" onClick={() => this.setAbility("invisibility")} src={require('../pictures/abilities/invisibility.png')} />
        </div>
        {rootState.username != null && rootState.avatar != null && rootState.powerAbility != null
          ?
          <div id="game-options">
            <Link to='/maze-manager' className="button yellow">Edit/Create Mazes</Link>
            <Link to='/single-player' className="button blue">Singleplayer</Link>
            <Link to='/multi-player' className="button green">Multiplayer</Link>
          </div>
          : null
        }
      </div>
    );
  }

  setUsername(){
    this.props.rootState.setState({
      username: document.getElementById('username').value
    })
  }

  setAvatar(avatar) {
    this.props.rootState.setState({
      avatar: avatar
    })
  }

  setAbility(ability) {
    this.props.rootState.setState({
      powerAbility: ability
    })
  }
}

export default Home
