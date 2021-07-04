import React from "react";
import { useHistory } from "react-router-dom";

function Wall() {

  const history = useHistory();
  const { state } = history.location;
  console.log("state", state);

  return (
    <div>it works</div>
  );
}

export default Wall;
