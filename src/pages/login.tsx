import React, { useState } from "react";
import { useHistory } from "react-router";
import { CONSTANTS } from "../constants";

interface FormErrors {
  username: string;
  password: string;
}

interface LoginPageProps {
  setUserToken: (token: string) => void;
}

export const LoginPage = ({ setUserToken }: LoginPageProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErrors] = useState<FormErrors>();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const login = () => {
    if (loading) return;

    let errorsState: boolean = false;
    const errors: FormErrors = Object.assign({}, err);

    if (!username || username === "") {
      errors.username = "Email can't be empty.";
      errorsState = true;
    }
    if (!password || password === "") {
      errors.password = "Password can't be empty.";
      errorsState = true;
    } else if (password.length < 6) {
      errors.password = "Password length is too short.";
      errorsState = true;
    }

    if (errorsState) {
      setErrors(errors);
      return;
    }

    setLoading(true);
    setErrors({
      username: "",
      password: "",
    });
    fetch(`${CONSTANTS.api}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "ok") {
          localStorage.setItem(CONSTANTS.LOCAL_STORAGE_TOKEN, res.data.jwt);
          setLoading(false);
          setUserToken(res.data.jwt);
          history.push("/");
        } else {
          if (res.errors && typeof res.errors === "string") {
            errors.password = res.errors;
          } else if (res.errors) {
            errors.username = res.errors.username;
            errors.password = res.errors.password;
          } else {
            errors.password = "Something went wrong, please contact support.";
          }
          setErrors(errors);
          setLoading(false);
        }
      })
      .catch((e) => {
        errors.password = "Something went wrong, please contact support.";
        setErrors(errors);
        setLoading(false);
      });
  };

  const changeUsername = (val: string) => {
    const errors: FormErrors = Object.assign({}, err);
    if (!val || val === "") {
      errors.username = "Email can't be empty.";
    } else {
      errors.username = "";
    }
    setErrors(errors);
    setUsername(val);
  };

  const changePassowrd = (val: string) => {
    const errors: FormErrors = Object.assign({}, err);
    if (!val || val === "") {
      errors.password = "Email can't be empty.";
    } else if (val.length < 6) {
      errors.password = "Password length is too short.";
    } else {
      errors.password = "";
    }
    setErrors(errors);
    setPassword(val);
  };

  return (
    <section>
      <h1>Login</h1>
      <form id="login-form">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => changeUsername(e.target.value)}
          disabled={loading}
          required={true}
        />
        {err && err.username && <p className="err">{err.username}</p>}
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => changePassowrd(e.target.value)}
          disabled={loading}
          required={true}
        />
        {err && err.password && <p className="err">{err.password}</p>}
        <input
          type="submit"
          name="login"
          value="login"
          onClick={login}
          disabled={loading}
        />
      </form>
    </section>
  );
};
