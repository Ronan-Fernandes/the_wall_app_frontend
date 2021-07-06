import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import "../App.css";
import Loading from "../components/Loading";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  function redirect (pathname, state) {
    history.push({ pathname, state });
  }

  function validateForm () {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !(regex.test(String(email).toLowerCase()) && name.length >= 3 && password.length >= 6 && confirm_password.length >= 6);
  }

  async function handleSubmit (event) {
    event.preventDefault();
    setLoading(true);
    const response = await api.createUser({ name, email, password, confirm_password });
    
    if (response.status === 201) {
      setLoading(false);
      return redirect("/");
    }
    
    setLoading(false);
    return setError(response.data.error.replace("[ref:password]", "equal to password."));
  }

  useEffect(() => {
    setDisableButton(validateForm());
  }, [name, email, password, confirm_password]);

  return (
    <div className="my-container">
      <div className="shadow-lg p-3 mb-5 bg-body rounded col-sm-4">
        <h1>Register</h1>
        {loading ? <Loading /> : error}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              id="name"
              className="form-control"
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="confirm_password">Confirm password</label>
            <input
              id="confirm_password"
              className="form-control"
              onChange={(event) => setConfirm_password(event.target.value)}
              type="password"
              placeholder="confirm_password"
            />
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-dark" type="button" onClick={() => redirect("/")}>
              cancel
            </button>
            <button className="btn btn-dark" disabled={disableButton} type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
