import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { CONSTANTS } from "./constants";
import { NotFoundPage } from "./pages/404";
import { BlogPage } from "./pages/blog";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/login";
import { RestrictedPage } from "./pages/restricted";
import { SignupPage } from "./pages/signup";

function App() {
  const [currentUserToken, setToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem(CONSTANTS.LOCAL_STORAGE_TOKEN);
    if (token) {
      fetch(`${CONSTANTS.api}/verify`, {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res && res.status === "ok") {
            setToken(res.data.jwt);
            localStorage.setItem(CONSTANTS.LOCAL_STORAGE_TOKEN, res.data.jwt);
          }
        })
        .catch((e) => {});
    }
  }, []);

  const logout = () => {
    localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_TOKEN);
    setToken("");
  };

  return (
    <Router>
      <div className="root">
        <Header onLogout={logout} token={currentUserToken} />
        <Switch>
          <Route path="/blog">
            <BlogPage />
          </Route>
          {currentUserToken && currentUserToken.length ? null : (
            <Route path="/login">
              <LoginPage setUserToken={setToken} />
            </Route>
          )}
          {currentUserToken && currentUserToken.length ? (
            <Route path="/restricted">
              <RestrictedPage />
            </Route>
          ) : (
            <Route path="/signup">
              <SignupPage setUserToken={setToken} />
            </Route>
          )}
          <Route path="/" exact={true}>
            <HomePage />
          </Route>
          <Route path="/">
            <NotFoundPage />
          </Route>
        </Switch>
        <div className="spacer"></div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
