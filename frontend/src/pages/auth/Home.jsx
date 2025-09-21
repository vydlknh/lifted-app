import React from "react";
import { Link } from 'react-router-dom'

function Home() {

  return (
    <div className="bg-pink-100 text-grey-900 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-grey-900">Lifted</h1>
          <p className="mt-2 mb-6 text-gray-600">Your journey to better health starts here.</p>
          <Link to="/signup">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-300 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300 mt-4">
            Sign up
            </button>
          </Link>
          <Link to="/login">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-300 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300 mt-4">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Home;