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
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(errorCode, errorMessage);
        // ..
      };
  };

  return (
    <main>
      <section>
        <div>
          <h1> Lifted </h1>
          <form>
            {error && <p className="error text-red">{error}</p>}
            <div>
              <label htmlFor="email-address">Email address</label>
              <input
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                label="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>

            <button type="submit" onClick={onSubmit}>
              Sign up
            </button>
          </form>

          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;