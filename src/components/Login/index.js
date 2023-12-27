import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    logedIn: false,
    username: '',
    password: '',
    errorTxt: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const loginUrl = 'https://apis.ccbp.in/login'
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      const {history} = this.props
      this.setState({logedIn: true})
      history.replace('/')
    } else {
      this.setState({errorTxt: data.error_msg})
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    const {logedIn, username, password, errorTxt} = this.state
    console.log(logedIn)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-div">
        <img
          className="website-logo"
          src="https://res.cloudinary.com/dksp7vfwl/image/upload/v1701673304/Movies%20App/Group_7399_z86vw3.png"
          alt="login website logo"
        />
        <div className="form-content-div">
          <div className="form-div">
            <form className="form" onSubmit={this.onFormSubmit}>
              <h1 className="login-head">Login</h1>
              <label className="label" htmlFor="username">
                USERNAME
              </label>
              <input
                className="input"
                id="username"
                type="text"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="Username"
              />
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="input"
                type="password"
                id="password"
                value={password}
                onChange={this.onChangePassword}
                placeholder="Password"
              />

              <button className="logIn-btn" type="submit">
                Login
              </button>
              {errorTxt !== '' ? (
                <p className="error-text">{errorTxt}</p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default Login
