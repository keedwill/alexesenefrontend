import React, { useState } from 'react'
import logo from '../images/icon-left-font-cut.jpg'
import { Link, useHistory } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const emailRegex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,30})$/i

  const loginCheck = (e) => {
    const errorDisplay = (message) => {
      document.querySelector('.errorMsg').innerText = message
      document
        .querySelector('.errorMsg')
        .animate(
          [
            { opacity: '0' },
            { opacity: '1' },
            { opacity: '1' },
            { opacity: '0' },
          ],
          { duration: 3000 }
        )
      setEmail('')
      setPassword('')
    }
    e.preventDefault()
    if (!emailRegex.test(email)) {
      errorDisplay(' Please enter a valid email')
    } else {
      const init = {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      }
      // fetch('http://localhost:5050/users/login', init);
      fetch('https://alexeseneblog.onrender.com/users/login', init)
          .then((res) => {
              if (res.status === 200) {
                  return res.json();
              } else if (res.status === 400) {
                  errorDisplay('User not found');
              } else if (res.status === 401) {
                  errorDisplay('Invalid password');
              } else if (res.status === 429) {
                  errorDisplay(
                      'You have reached the maximum number of attempts allowed. Please try again in an hour'
                  );
              } else {
                  errorDisplay('An error has occurred');
              }
          })
          .then((data) => {
            
              localStorage.setItem('token', JSON.stringify(data.token));
              history.push('/dashboard');
          })
          .catch((error) => console.log(error));
    }
  }

  return (
      <>
          <section className="container">
              <Link to="/">
                  <img src={'https://i.imgur.com/mlvn4K4.jpg'} alt="logo" className="logo" />
              </Link>
              <article className="form">
                  <form onSubmit={loginCheck}>
                      <h1>Login</h1>
                      <div className="form-control">
                          <label htmlFor="email">Email :</label>
                          <input
                              type="email"
                              id="email"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                          />
                      </div>
                      <div className="form-control">
                          <label htmlFor="password">Password :</label>
                          <input
                              type="password"
                              id="password"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                          />
                      </div>
                      <button type="submit" className="btn">
                          To log in
                      </button>
                      <p className="errorMsg"></p>
                  </form>
                  <div className="messageBox">
                      <p>
                          You are not registered yet ?
                          <Link to="/signup">
                              <span className="signupLink">Create an account</span>
                          </Link>
                      </p>
                      <p>
                          Forgot your password ? Contact{' '}
                          <span>admin@usmandanfodiouniversity.com</span>
                      </p>
                  </div>
              </article>
          </section>
      </>
  );
}

export default Login
