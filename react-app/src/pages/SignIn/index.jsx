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
    const makeAvatarImage = (avatar) => {
      return (
        <img
          className={this.getAvatarClass(avatar)}
          id={avatar}
          ref={avatar}
          onClick={() => this.setAvatar(avatar)}
          src={require(`../../pictures/avatars/${avatar}.svg`)}
          alt={avatar}
        />
      )
    };
    const makeAbilityImage = (ability) => {
      return (
        <img
          className={this.getAbilityClass(ability)}
          id={ability}
          ref={ability}
          onClick={() => this.setAbility(ability)}
          src={require(`../../pictures/abilities/${ability}.svg`)}
          alt={ability}
        />
      )
    };
    return (
      <div id="sign-in">
        <h2>Sign In</h2>
        <input type="text" id="username" onChange={this.setUsername} placeholder="Enter a username here..." defaultValue={this.props.rootState.state.username}/>
        <h2>Choose your avatar</h2>
        <div id="avatars">
          {makeAvatarImage("circle")}
          {makeAvatarImage("square")}
          {makeAvatarImage("sun")}
          {makeAvatarImage("triangle")}
          {makeAvatarImage("smile")}
          {makeAvatarImage("star")}
        </div>
        <h2>Choose your power ability</h2>
        <div id="power-ability">
          {makeAbilityImage("dig")}
          {makeAbilityImage("slime")}
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
