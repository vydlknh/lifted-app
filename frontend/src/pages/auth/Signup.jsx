import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth, validatePassword} from "firebase/auth";
import { auth } from "../../firebase";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePasswordRequirements = async (password) => {
    const status = await validatePassword(getAuth(), password);
    if (!status.isValid) {
      const needsLowerCase = status.containsLowercaseLetter !== true;
      const needsUpperCase = status.containsUppercaseLetter !== true;
      const needsDigit = status.containsDigit !== true;
      const tooShort = status.isTooShort === true;

      if (needsLowerCase || needsUpperCase || needsDigit || tooShort) {
        return("Password must be at least 8 characters long, containing numbers, uppercase and lowercase letters.");
      }
    }
    return status.isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = await validatePasswordRequirements(password);
    if (validationError !== true) {
      setError(validationError);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      console.log(user);
      navigate("/questionnaire");
    } catch(error) {
        setError(error.code === 'auth/email-already-in-use' ? 'Email address is already in use.' : 'Failed to create an account.');
        console.error(error);
      };
  };

  return (
    <div className="bg-pink-100 text-grey-900 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-grey-900">Lifted</h1>
          <p className="mt-2 mb-6 text-gray-600">Create an account</p>
        </div>
        <form className="space-y-6">
          {error && <p className="error text-red">{error}</p>}
          <div>
            <label htmlFor="email-address" className="text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              label="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
            />
          </div>

          <button type="submit" onClick={onSubmit} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 mt-4">
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <span className="font-medium text-pink-600 hover:text-pink-500"><Link to="/login">Log in</Link></span>
        </p>
      </div>
    </div>
  );
};

export default Signup;