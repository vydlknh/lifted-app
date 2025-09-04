import { useRoutes } from 'react-router-dom'
import Home from './pages/auth/Home'
import Dashboard from './pages/Dashboard'
import CycleTracking from './pages/CycleTracking'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Questionnaire from './pages/profile/Questionnaire'
import './App.css'

function App() {
  let element = useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/cycle-tracking',
      element: <CycleTracking />
    },
    {
      path: '/progress',
      element: <Progress />
    },
    {
      path: '/profile',
      element: <Profile />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/questionnaire',
      element: <Questionnaire />
    }
  ])

  return (
    <div className="App">
      {element}
    </div>
  )
}

export default App;
