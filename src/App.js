import { BrowserRouter as Router, Switch } from 'react-router-dom'
import './style.css'
// pages
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
// Routes
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute component={Login} exact path='/' />
        <PublicRoute component={Login} path='/login' />
        <PublicRoute component={Signup} path='/signup' />
        <PrivateRoute component={Profile} path='/profile/:id' />
        <PrivateRoute component={Dashboard} path='/dashboard' />
      </Switch>
    </Router>
  )
}

export default App
