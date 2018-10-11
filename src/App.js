import React, { Component } from 'react';
import './App.css';

import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
const Auth = new AuthService('http://localhost:3001');

class App extends Component {
  fetch_data() {
    Auth.fetch('/api/v1/hello', {
      method: 'GET',
      credentials: 'same-origin'
    }).then(response => {
      console.log(response)
    })
  }

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
          <br />
          <br />
          <button type="button" className="form-submit" style={{width: '100px'}} onClick={this.fetch_data.bind(this)}>Fetch data</button>
        </p>
      </div>
    );
  }
}

export default withAuth(App);
