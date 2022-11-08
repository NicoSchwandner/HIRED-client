import { Link } from "react-router-dom";

import React from "react";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to the <span className="nowrap">HIRED Issue Tracker!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          This application is intended as a coding example used for applications
          as a Full-Stack programmer. If you have any questions, don't hesitate
          to reach out to me!
        </p>
        <address className="public__addr">
          Nicolas Schwandner
          <br />
          Kabelgatan 37E
          <br />
          41457 Göteborg
          <br />
          Sweden
          <br />
          <a href="tel:+46793009693">(+46) 79 300 96 93</a>
          <br />
          <a href="mailto:nico.schwandner@gmail.com">
            nico.schwandner@gmail.com
          </a>
        </address>
      </main>
      <footer>
        <Link to="/login">User Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
