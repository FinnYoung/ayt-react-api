import React, { Component } from 'react';
import './Login.css';
import ayt_logo from '../askyourteam.svg';

import AuthService from './AuthService';

class Login extends Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.Auth = new AuthService();
    this.state = {
      user: null
    }
  }
  componentWillMount(){
    if(this.Auth.loggedIn()) {
      this.props.history.replace('/');
    }
  }
  render() {
    return (
      <div className="center">
        <div className="card">
          <div className="content">
            <img src={ayt_logo} alt="logo" />
            <h1>Log In</h1>
            <form onSubmit={this.handleFormSubmit}>
              <input className="form-item" placeholder="Email"
                     name="email" type="text" onChange={this.handleChange}  />
              <input className="form-item" placeholder="Password"
                     name="password" type="password" onChange={this.handleChange} />
              <input className="form-submit" value="Log In" type="submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }

  handleChange(e){
    this.setState(
      {
        [e.target.name]: e.target.value
      }
    )
  }

  handleFormSubmit(e){
    e.preventDefault();

    this.Auth.login(this.state.email, this.state.password)
        .then(res =>{
          this.props.history.replace('/');
        })
        .catch(err =>{
          alert(err);
        })
  }
}

export default Login;
