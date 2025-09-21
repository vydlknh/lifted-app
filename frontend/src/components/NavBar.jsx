import { Link, useNavigate} from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"

function NavBar(){
  const navigate = useNavigate();

  const handleLogout = async () => {
    signOut(auth).then(() => {
      navigate("/");
      console.log("User signed out");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  }

  return (
    <div>
      <nav className="dashboard">
        <div className="logged_out">
          <Link to="/dashboard">Lifted</Link>
        </div>
        <div className="hidden">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/cycle-tracking">Cycle Tracking</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </div>
  )
}

export default NavBar