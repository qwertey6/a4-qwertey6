import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import SinglePlayer from "./pages/SinglePlayer";
import MultiPlayer from "./pages/MultiPlayer";
import MazeManager from "./pages/MazeManager";
import SignIn from './pages/SignIn'
import ReactTooltip from 'react-tooltip'
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './app.css'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: null,
      icon: null,
      ability: null,
      userID: Date.now().toString(36)
    }
  }

  render() {
    const player = {
      username: this.state.username,
      icon: this.state.icon,
      ability: this.state.ability,
      id: this.state.userID
    };
    return (
      <Router>
        <div id="app">
          <NotificationContainer />
          <ReactTooltip place="bottom" type="success" effect="float"/>
          <Link to="/" id="home-button"><img id="home-icon" src={require('./home-icon.png')} /></Link>
          <h1 id="title">MAZE CRAZE</h1>
          <Switch>
            <Route exact path="/" render={(props) => <SignIn {...props} rootState={this} />} />
            <Route path="/maze-manager" component={MazeManager} />
            <Route path="/single-player" component={SinglePlayer} />
            <Route path="/multi-player" render={(props) => <MultiPlayer {...props} player={player} />} />
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
