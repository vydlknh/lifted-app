import React from "react";
import { Link } from 'react-router-dom'

function Home() {

  return (
    <section>
      <div className="header">
        <h1>Lifted</h1>
        <Link to="/signup"><button>Sign up</button></Link>
        <Link to="/login"><button>Login</button></Link>
      </div>
    </section>
  );
};
export default Home;