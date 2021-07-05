import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({ authenticated: false, user: {} });
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(true);

  const history = useHistory();

  function redirect(pathname, state) {
    history.push({ pathname, state });
  }

  function validateForm() {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !(regex.test(String(email).toLowerCase()) && password.length >= 6);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await api.login(email, password);

    if (response.status === 200) {
      return setUserInfo({
        user: { ...response.data },
        authenticated: true,
      });
    }

    if (response.status === 401) {
      return setError(response.data.message);
    }

    return setError(response.data.error);
  }

  useEffect(() => {
    setDisableButton(validateForm());
  }, [email, password]);

  useEffect(() => {
    if (userInfo.authenticated) {
      localStorage.setItem("user", JSON.stringify({ ...userInfo.user }));
      redirect("/wall", { ...userInfo });
    }
  }, [userInfo]);

  return (
    <div className="my-container">
      <div className="container">
        <div className="row">
        <div className="col"></div>
          <form className="col-sm-4 align-self-center shadow p-3 mb-5 bg-body rounded" onSubmit={handleSubmit}>
            {error}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                className="form-control"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="form-control"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="d-flex justify-content-between ">
              <button className="btn btn-primary" disabled={disableButton} type="submit">
                Login
              </button>
              <button className="btn btn-primary" type="button" onClick={() => redirect("/register")}>
                Register
              </button>
              <button className="btn btn-primary"  type="button" onClick={() => redirect("/wall", { ...userInfo })}>
                Enter as a guest
              </button>
            </div>
          </form>
          <div className="col"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
