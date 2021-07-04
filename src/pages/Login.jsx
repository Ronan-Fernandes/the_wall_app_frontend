import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({ authenticated: false, user: {} });
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(true);

  const history = useHistory();

  function validateForm () {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !(regex.test(String(email).toLowerCase()) && password.length >= 6);
  }

  async function handleSubmit (event) {
    event.preventDefault();
    const response = await api.login(email, password);

    if (response.status === 200) {
      return setUserInfo({
        user: { ...response },
        authenticated: true,
      });
    }

    if (response.status === 401) {
      return setError(response.data.message);
    }

    return setError(response.data.error);
  }

  function redirect (pathname, state) {
    history.push({ pathname, state });
  }

  useEffect(() => {
    setDisableButton(validateForm());
  }, [email, password]);

  useEffect(() => {
    if (userInfo.authenticated) {
      redirect("/wall", { ...userInfo });
    }
  }, [userInfo]);

  return (
    <div>
      <h1>Login Page</h1>
      {error}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <button disabled={disableButton} type="submit">
          Login
        </button>
      </form>
      <button type="button" onClick={() => redirect("/register")}>
        Register
      </button>
      <button type="button" onClick={() => redirect("/wall")}>
        Enter as a guest
      </button>
    </div>
  );
}

export default Login;
