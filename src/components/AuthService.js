import decode from 'jwt-decode';
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
    return fetch(`${this.domain}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({format: 'json', user: { email: email, password: password } })
    }).then(response => {
      if (response.status === 200) {
        this.setToken(response.headers.get('Authorization')) // Setting the token in localStorage
        response.json().then(json => {
          this.setUser(json.user)
          console.log('Hello ' + json.user.name);
        });
      } else if (response.status === 401) {
        response.json().then(json => {
          console.log(json);
        });
      }
      return Promise.resolve(response);
    })
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token) // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    localStorage.setItem('id_token', idToken)
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout() {
    return this.fetch(`${this.domain}/api/v1/logout`, {
      method: 'DELETE',
      credentials: 'same-origin',
      body: JSON.stringify({format: 'json' })
    }).then(
      this.clearUserProfile()
    )
  }

  clearUserProfile() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  getUser() {
    return  JSON.parse(localStorage.getItem('user'))
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers['Authorization'] = this.getToken()
    }

    return fetch(url, { headers, ...options})
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
