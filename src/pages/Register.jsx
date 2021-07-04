import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";

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
    setLoading(false);

    if (response.status === 201) {
     return redirect("/");
    }

    return setError(response.data.error.replace("[ref:password]", "equal to password."));
  }

  useEffect(() => {
    setDisableButton(validateForm());
  }, [name, email, password, confirm_password]);

  return (
    <div>
      <h1>Register Page</h1>
      {loading ? <div>Loading ...</div> : error}
      <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
        <br />
        <input
          id="name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
        />
        <br />
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
        <label htmlFor="confirm_password">Confirm password</label>
        <br />
        <input
          id="confirm_password"
          onChange={(event) => setConfirm_password(event.target.value)}
          type="password"
          placeholder="confirm_password"
        />
        <br />
        <button disabled={disableButton} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
