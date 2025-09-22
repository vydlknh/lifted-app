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
    <header className="bg-pink-200 drop-shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
            <Link to="/dashboard" className="text-xl font-bold text-gray-800">Lifted</Link>
        </div>

        <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-pink-400">Dashboard</Link>
            <Link to="/cycle-tracking" className="text-gray-600 hover:text-pink-400">Cycle Tracking</Link>
            <Link to="/profile" className="text-gray-600 hover:text-pink-400">Profile</Link>
            <button 
                onClick={handleLogout}
                className="bg-pink-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
                Logout
            </button>
        </div>
      </nav>
    </header>
  )
}

export default NavBar