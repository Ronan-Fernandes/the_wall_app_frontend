import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import "../App.css";
import Loading from "../components/Loading";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({ authenticated: false, user: {} });
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const response = await api.login(email, password);

    if (response.status === 200) {
      setUserInfo({
        user: { ...response.data },
        authenticated: true,
      });

      return setIsLoading(false);
    }

    if (response.status === 401) {
      setError(response.data.message);
      return setIsLoading(false);
    }

    setError(response.data.error);
    return setIsLoading(false);

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
      <div className="shadow-lg p-3 mb-5 bg-body rounded col-sm-4">
        <h1>The Wall</h1>
          {isLoading ? <Loading /> : error}
        <form onSubmit={handleSubmit}>
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
            <button
              className="btn btn-dark"
              type="button"
              onClick={() => redirect("/wall", { ...userInfo })}
            >
              Enter as a guest
            </button>
            <button className="btn btn-dark" type="button" onClick={() => redirect("/register")}>
              Register
            </button>
            <button className="btn btn-dark" disabled={disableButton} type="submit">
              Login
            </button>
          </div>
        </form>
        <div className="col"></div>
      </div>
    </div>
  );
}

export default Login;
