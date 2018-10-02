import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import SinglePlayer from "./pages/SinglePlayer";
import MultiPlayer from "./pages/MultiPlayer";
import MazeManager from "./pages/MazeManager";
import SignIn from './pages/SignIn'
import './app.css'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: null,
      avatar: null,
      powerAbility: null,
    }
  }

  render() {
    return (
      <Router>
        <div id="app">
          <Link to="/" id="home-button"><img id="home-icon" src={require('./home-icon.png')} /></Link>
          <h1 id="title">MAZE CRAZE</h1>
          <Switch>
            <Route exact path="/" render={(props) => <SignIn {...props} rootState={this} />} />
            <Route path="/maze-manager" component={MazeManager} />
            <Route path="/single-player" component={SinglePlayer} />
            <Route path="/multi-player" component={MultiPlayer} />
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
