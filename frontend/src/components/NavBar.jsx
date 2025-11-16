import { NavLink, useNavigate} from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useState } from "react"

function NavBar(){
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    signOut(auth).then(() => {
      navigate("/");
      console.log("User signed out");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  }

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "text-green-900 px-3 py-2 rounded-md text-md font-semibold";
    const activeClasses = "font-bold text-pink-600";
    const inactiveClasses = "hover:text-pink-600";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <header className="bg-pink-200 drop-shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <NavLink to="/dashboard" className="text-xl font-bold text-green-900"><img src="dumbbell.png" alt="dumbbell" height={30} width={30}/></NavLink>
          <NavLink to="/dashboard" className="text-2xl font-bold text-green-900">Lifted</NavLink>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="md:hidden text-green-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
          <NavLink to="/cycle-tracking" className={getNavLinkClass}>Cycle Tracking</NavLink>
          <NavLink to="/profile" className={getNavLinkClass}>Profile</NavLink>
          <button 
            onClick={handleLogout}
            className="bg-green-800 text-white px-4 py-2 rounded-md text-md font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-pink-200 md:hidden flex flex-col space-y-2 px-4 py-4">
            <NavLink to="/dashboard" className={getNavLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
            <NavLink to="/cycle-tracking" className={getNavLinkClass} onClick={() => setIsOpen(false)}>Cycle Tracking</NavLink>
            <NavLink to="/profile" className={getNavLinkClass} onClick={() => setIsOpen(false)}>Profile</NavLink>
            <button 
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="bg-green-800 text-white px-4 py-2 rounded-md text-md font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default NavBar