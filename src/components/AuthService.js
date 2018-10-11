export default class AuthService {
  // Initializing important variables
  constructor(domain) {
    this.domain = domain || 'http://localhost:3001' // API server domain
    this.fetch = this.fetch.bind(this) // React binding stuff
    this.login = this.login.bind(this)
    this.getProfile = this.getProfile.bind(this)
  }

  login(email, password) {
    // Get a token from api server using the fetch api
    return fetch(this.domain + '/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({format: 'json', email: email, password: password, grant_type: 'password' })
    })
    .then(response => response.json())
    .then(json => {
      return this.setToken(json);
    })
    .then(storage => {
      return this.fetchUser();
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    return !!token && this.isTokenValid(token) // handwaiving here
  }

  isTokenValid(token) {
    try {
      var currentDate = new Date()
      if (token.created_at + token.expires_in > (currentDate / 1000 - currentDate.getTimezoneOffset())) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  setToken(token) {
    return localStorage.setItem('token', JSON.stringify(token))
  }
  
  fetchUser() {
    return this.fetch('/api/v1/users/sync', {
      method: 'GET',
      credentials: 'same-origin'
    }).then(this.setUser)
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  getToken() {
    // Retrieves the user token from localStorage
    return JSON.parse(localStorage.getItem('token'))
  }

  logout() {
    return this.fetch('/oauth/revoke', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({token: this.getToken().access_token })
    }).then(
      this.clearUserProfile()
    )
  }

  clearUserProfile() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return this.getToken();
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    var access_token_param = ''
    if (this.loggedIn()) {
      access_token_param = '?access_token=' + this.getToken().access_token;
    }

    return fetch(this.domain + url + access_token_param, { headers, ...options})
    .then(this._checkStatus)
    .then(this._returnJson)
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  _returnJson(response) {
    if (response.status !== 204) {
      return response.json()
    }
  }
}
