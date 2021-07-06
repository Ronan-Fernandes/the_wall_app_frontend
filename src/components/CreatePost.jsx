import PropTypes from "prop-types";
import React, { useState } from "react";
import api from "../services/api";
import Loading from "./Loading";

function CreatePost({ user, getPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function clearLocalState() {
    setTitle("");
    setContent("");
    setError("");
  }

  async function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const response = await api.createPost({ title, content }, user.token);

    if (response.status === 201) {
      clearLocalState();
      await getPosts();
      return setIsLoading(false);
    }

    if (response.status === 401) {
      setError(response.data.message);
      return setIsLoading(false);
    }

    setError(response.data.error);
    return setIsLoading(false);
  }

  return (
    <div>
      <div>{isLoading ? <Loading /> : error}</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input className="form-control" value={title} type="text" onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea className="form-control" value={content} onChange={(event) => setContent(event.target.value)} />
        </div>
        <div className="d-flex justify-content-end">
          <button className="bi bi-check-lg btn" type="submit" />
        </div>
      </form>
    </div>
  );
}

CreatePost.propTypes = {
  getPosts: PropTypes.func,
  user: PropTypes.shape({
    token: PropTypes.string,
  }),
};

export default CreatePost;
