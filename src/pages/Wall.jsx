import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import CreatePost from "../components/CreatePost";
import Posts from "../components/Posts";

function Wall() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [filterUserPosts, setFilterUserPosts] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const history = useHistory();
  const { state } = history.location;

  function redirect(pathname, state) {
    history.push({ pathname, state });
  }

  async function getPosts() {
    const response = await api.getPosts();
    if (response.status === 200) {
      setPosts([...response.data].reverse());
      setFilteredPosts([...response.data.filter((post) => post.userId === user.userId).reverse()]);
    }
  }

  function handleLogout() {
    localStorage.clear();
    redirect("/");
  }

  function setSession() {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (state) {
      setUser(state.user);
      return setAuthenticated(state.authenticated);
    }

    if (!state && storedUser) {
      setUser(storedUser);
      return setAuthenticated(true);
    }

    setUser({});
    return setAuthenticated(false);
  }

  useEffect(async () => {
    setSession();
    await getPosts();
  }, []);

  return (
    <div>
      <header>
        <div>The Wall</div>
        <p>Hey {authenticated ? user.name : "Anonymous"} welcome to the Wall </p>
        {authenticated ? (
          <button type="button" onClick={() => handleLogout()}>
            Logout
          </button>
        ) : (
          <button type="button" onClick={() => redirect("/")}>
            Login
          </button>
        )}
      </header>
      <section>
        <h1>The Wall</h1>
        {authenticated ? (
          <div>
            <button
              disabled={!filterUserPosts}
              type="button"
              onClick={() => setFilterUserPosts(!filterUserPosts)}
            >
              All Posts
            </button>
            <button
              disabled={filterUserPosts}
              type="button"
              onClick={() => setFilterUserPosts(!filterUserPosts)}
            >
              My Posts
            </button>
          </div>
        ) : (
          ""
        )}
        {authenticated ? <CreatePost user={user} getPosts={getPosts} /> : ""}
        <Posts posts={filterUserPosts ? filteredPosts : posts} user={user} getPosts={getPosts} />
      </section>
    </div>
  );
}

export default Wall;
