import React, { Component } from 'react';
import './App.css';

import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
const Auth = new AuthService();

class App extends Component {
  handleLogout(){
    Auth.logout()
    this.props.history.replace('/login');
  }

  render() {
    return (
      <div className="App">
        <h2>Welcome {this.props.user.name}</h2>
        <p className="App-intro">
          <button type="button" className="form-submit" style={{width: '100px'}} onClick={this.handleLogout.bind(this)}>Logout</button>
        </p>
      </div>
    );
  }
}

export default withAuth(App);
