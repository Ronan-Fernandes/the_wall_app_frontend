import PropTypes from "prop-types";
import React, { useState } from "react";
import api from "../services/api";

function CreatePost({ user, getPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await api.createPost({ title, content }, user.token);

    if (response.status === 201) {
      await getPosts();
    }

    if (response.status === 401) {
      return setError(response.data.message);
    }

    return setError(response.data.error);
  }

  return (
    <div>
      <div>{error}</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <br />
        <input type="text" onChange={(event) => setTitle(event.target.value)} />
        <label htmlFor="content">Content</label>
        <br />
        <textarea onChange={(event) => setContent(event.target.value)} />
        <button type="submit">Save</button>
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
