import { useRoutes, Navigate, Outlet } from 'react-router-dom'
import Home from './pages/auth/Home'
import Dashboard from './pages/Dashboard'
import CycleTracking from './pages/CycleTracking'
import Profile from './pages/Profile'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Questionnaire from './pages/profile/Questionnaire'
import NavBar from './components/NavBar'
import { AuthProvider, useAuth } from './pages/auth/AuthContext';
import './App.css'

const ProtectedLayout = () => {
    const { user, loading } = useAuth();

    // Loading message while firebase is checking the auth state
    if (loading) {
      return (
        <div className="bg-pink-100 text-grey-900 flex justify-center min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-green-900">Loading...</h1>
          </div>
        </div>
        )
    }

    // If loading is complete and there's no user, redirect to the home page
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If the user is logged in, render the navigation bar and the requested page
    return (
      <div>
        <NavBar />
        <main>
          <div className="main-content">
            <Outlet />
          </div>
        </main>
      </div>
    );
};

function AppRoutes() {
  const element = useRoutes([
    {
      path: '/',
      element: <Home />
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
      // Protected routes, only accessible if logged in
      element: <ProtectedLayout />,
      children: [
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/cycle-tracking',
          element: <CycleTracking />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/questionnaire',
          element: <Questionnaire />
        }
      ]
    },
  ])

  return element
}

export default function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}