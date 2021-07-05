import PropTypes from "prop-types";
import React, { useState } from "react";
import api from "../services/api";

function Posts({ posts, user, getPosts }) {
  const [editPost, setEditPost] = useState(false);
  const [postToBeEdited, setPostToBeEdited] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLocalStateUpdate, setIsLocalStateUpdated] = useState(false);

  function resetAllLocalState() {
    setEditPost(false);
    setIsLocalStateUpdated(false);
    setPostToBeEdited("");
    setTitle("");
    setContent("");
    setError("");
  }

  async function handleSubmitToEdit(event) {
    event.preventDefault();
    const response = await api.editPost({ title, content }, user.token, postToBeEdited);

    if (response.status === 204) {
      resetAllLocalState();
      await getPosts();
    }

    if (response.status === 401) {
      return setError(response.data.message);
    }

    return setError(response.data.error);
  }

  async function handleDeletePost(id) {
    const response = await api.deletePost(id, user.token);

    if (response.status === 204) {
      resetAllLocalState();
      await getPosts();
    }

    if (response.status === 401) {
      return setError(response.data.message);
    }

    return setError(response.data.error);
  }

  async function cancelEdit() {
    resetAllLocalState();
    await getPosts();
  }

  function updateLocalState(post) {
    setTitle(post.title);
    setContent(post.content);
    setIsLocalStateUpdated(true);
  }

  return posts.map((post) => {
    if (editPost && post._id === postToBeEdited) {
      if (!isLocalStateUpdate) updateLocalState(post);
      return (
        <div key={post._id}>
          <div>{error}</div>
          <form onSubmit={handleSubmitToEdit}>
            <label htmlFor="title">Title</label>
            <br />
            <input
              id="title"
              name="title"
              type="text"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
            <br />
            <label htmlFor="content">Content</label>
            <br />
            <textarea
              id="content"
              name="content"
              onChange={(event) => setContent(event.target.value)}
              value={content}
            />
            <br />
            <button type="submit">Save</button>
          </form>
          <button type="button" onClick={() => cancelEdit()}>
            cancel
          </button>
        </div>
      );
    }

    return (
      <div key={post._id}>
        <div>
          <h3>{post.title}</h3>
          {post.userId === user.userId ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setPostToBeEdited(post._id);
                  setEditPost(true);
                }}
              >
                edit post
              </button>
              <button type="button" onClick={() => handleDeletePost(post._id)}>
                delete post
              </button>
            </>
          ) : (
            ""
          )}
        </div>
        <p>{post.content}</p>
        <h4>{post.name}</h4>
      </div>
    );
  });
}

Posts.propTypes = {
  getPosts: PropTypes.func,
  posts: PropTypes.array,
  user: PropTypes.shape({
    token: PropTypes.string,
    userId: PropTypes.string,
  }),
};

export default Posts;
