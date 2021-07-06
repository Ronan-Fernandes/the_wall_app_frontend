import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loading from "./Loading";

function Posts({ posts, user, getPosts }) {
  const [editPost, setEditPost] = useState(false);
  const [postToBeEdited, setPostToBeEdited] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLocalStateUpdated, setIsLocalStateUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postToBeDeleted, setPostToBeDeleted] = useState("");

  function resetAllLocalState() {
    setEditPost(false);
    setIsLocalStateUpdated(false);
    setPostToBeEdited("");
    setTitle("");
    setContent("");
    setError("");
    setPostToBeDeleted("");
  }

  async function handleSubmitToEdit(event) {
    event.preventDefault();
    setIsLoading(true);
    const response = await api.editPost({ title, content }, user.token, postToBeEdited);

    if (response.status === 204) {
      resetAllLocalState();
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

  async function handleDeletePost(id) {
    setPostToBeDeleted(id);
    setIsLoading(true);

    const response = await api.deletePost(id, user.token);

    if (response.status === 204) {
      resetAllLocalState();
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

  async function cancelEdit() {
    resetAllLocalState();
    await getPosts();
  }

  function updateLocalState(post) {
    setTitle(post.title);
    setContent(post.content);
    setIsLocalStateUpdated(true);
  }

  useEffect(() => {
    setIsLocalStateUpdated(false);
    setError("");
  }, [postToBeEdited]);

  return posts.map((post) => {
    if (editPost && post._id === postToBeEdited) {
      if (!isLocalStateUpdated) updateLocalState(post);
      return (
        <div key={post._id} className="shadow-lg p-3 mb-5 bg-body rounded">
          <div>{isLoading ? <Loading /> : error}</div>
          <form onSubmit={handleSubmitToEdit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                className="form-control"
                name="title"
                type="text"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                id="content"
                className="form-control"
                name="content"
                onChange={(event) => setContent(event.target.value)}
                value={content}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button className="bi bi-x-lg btn" type="button" onClick={() => cancelEdit()} />

              <button className="bi bi-check-lg btn" type="submit" />
            </div>
          </form>
        </div>
      );
    }

    return (
      <div key={post._id} className="shadow-lg p-3 mb-5 bg-body rounded">
        <div>
          {isLoading && post._id === postToBeDeleted ? (
            <Loading />
          ) : error && post._id === postToBeDeleted ? (
            error
          ) : (
            ""
          )}
        </div>
        <div className="d-flex justify-content-between">
          <h3>{post.title}</h3>
          <div>
            {post.userId === user.userId ? (
              <>
                <i
                  type="button"
                  className="bi bi-pencil btn"
                  onClick={() => {
                    setPostToBeEdited(post._id);
                    setEditPost(true);
                  }}
                />
                <i
                  className="bi bi-trash btn"
                  type="button"
                  onClick={() => handleDeletePost(post._id)}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <p>{post.content}</p>
        <h6 className="d-flex justify-content-end">{post.name}</h6>
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
