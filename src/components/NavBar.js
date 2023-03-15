import React from 'react'
import logo from '../images/icon-left-font-cut.jpg'
import { Link, useHistory } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { BsFillPersonFill } from 'react-icons/bs'
import { RiCommunityLine } from 'react-icons/ri'

const NavBar = () => {
  const history = useHistory()
  const token = JSON.parse(localStorage.getItem('token'))
  const tokenParts = token.split('.')
  const encodedPayload = tokenParts[1]
  const rawPayload = atob(encodedPayload)
  const tokenUser = JSON.parse(rawPayload)

  const logout = () => {
    localStorage.removeItem('token')
    history.push('/login')
  }

  return (
      <>
          <header>
              <Link to="/dashboard">
                  <img src={'https://i.imgur.com/mlvn4K4.jpg'} alt="logo" className="logo_header" />
              </Link>
              <nav>
                  <ul>
                      <Link to="/dashboard">
                          <li className="navBarText">Community</li>
                          <li className="navBarIcons">
                              <RiCommunityLine size={26} className="colorIcons" />
                          </li>
                      </Link>
                      <Link to={`/profile/${tokenUser.userId}`}>
                          <li className="navBarText">Profile</li>
                          <li className="navBarIcons">
                              <BsFillPersonFill size={26} className="colorIcons" />
                          </li>
                      </Link>
                      <li className="navBarText" onClick={logout}>
                          Logout
                      </li>
                      <li className="navBarIcons">
                          <FiLogOut size={26} className="colorIcons" onClick={logout} />
                      </li>
                  </ul>
              </nav>
          </header>
      </>
  );
}

export default NavBar
