import { Outlet, Link } from "react-router"

function NavBar(){
  return (
    <div>
      <nav className="dashboard">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/cycle-tracking">Cycle Tracking</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default NavBar