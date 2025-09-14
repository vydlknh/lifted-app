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
        <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="text-xl font-bold text-green-900"><img src="dumbbell.png" alt="dumbbell" height={30} width={30}/></Link>
            <Link to="/dashboard" className="text-2xl font-bold text-green-900">Lifted</Link>
        </div>

        <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-green-900 hover:text-green-700 font-bold">Dashboard</Link>
            <Link to="/cycle-tracking" className="text-green-900 hover:text-green-700 font-bold">Cycle Tracking</Link>
            <Link to="/profile" className="text-green-900 hover:text-green-700 font-bold">Profile</Link>
            <button 
                onClick={handleLogout}
                className="bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <div className="font-bold">
                Logout
              </div>
            </button>
        </div>
      </nav>
    </header>
  )
}

export default NavBar