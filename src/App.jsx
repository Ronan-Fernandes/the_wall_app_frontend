import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wall from "./pages/Wall";

function App() {
  return (
    <Switch>
      <Route exact path="/wall" component={Wall}  />
      <Route exact path="/register" component={Register}  />
      <Route exact path="/" component={Login}  />
    </Switch>
  );
}

export default App;
