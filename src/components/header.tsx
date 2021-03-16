import React from "react";
import { Link, useHistory } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
  token: string;
}

export const Header = ({ onLogout, token }: HeaderProps) => {
  const history = useHistory();
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/blog">Blog</Link>
      <span className="spacer"></span>
      {token && token.length ? (
        <Link to="/restricted">restricted</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {token && token.length ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();

            history.push("/");
          }}
        >
          logout
        </a>
      ) : (
        <Link to="/signup">Signup</Link>
      )}
    </nav>
  );
};
