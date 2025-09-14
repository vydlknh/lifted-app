import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    setError("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/dashboard");
        console.log(user);
      })
      .catch((error) => {
        setError("Invalid email or password. Please try again.");
        console.error(error);
      });
  };

  return (
    <div className="bg-pink-100 text-grey-900 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-900">Lifted</h1>
          <p className="mt-2 mb-6 text-gray-600">Welcome back!</p>
        </div>
        <form className="space-y-6">
          {error && <p className="error text-red">{error}</p>}
          <div>
            <label htmlFor="email-address" className="text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
            />
          </div>

          <div>
            <button onClick={onLogin} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 mt-4">
              Log in
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          No account yet? <span className="font-medium text-green-700 hover:text-green-600"><Link to="/signup">Sign up</Link></span>
        </p>
      </div>
    </div>
  );
};

export default Login;