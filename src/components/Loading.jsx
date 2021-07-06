import PropTypes from "prop-types";
import React from "react";

function Loading({ loadingClass }) {
  return (
    <div className={loadingClass ? "my-container" : ""}>
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

Loading.propTypes = {
  loadingClass: PropTypes.bool
};

export default Loading;
