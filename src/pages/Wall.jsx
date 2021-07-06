import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import CreatePost from "../components/CreatePost";
import Posts from "../components/Posts";
import "../App.css";
import Loading from "../components/Loading";

function Wall() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [filterUserPosts, setFilterUserPosts] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [firstLoading, setFirstLoading] = useState(true);

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
      setUser({ ...storedUser });
      return setAuthenticated(true);
    }

    setUser({});
    return setAuthenticated(false);
  }

  useEffect(async () => {
    setFirstLoading(true);
    setSession();
    await getPosts();
    setFirstLoading(false);
  }, []);

  useEffect(() => {
    setFilteredPosts([...posts.filter((post) => post.userId === user.userId)]);
  }, [posts]);

  return firstLoading ? (
    <Loading loadingClass={true} />
  ) : (
    <div className="my-center">
      <div className="col-sm-8">
        <header className="shadow-lg p-3 mb-5 bg-body rounded">
          <nav className="d-flex justify-content-between">
            <img src="The_Wall.jpg" alt="The Wall" width="5%" />
            <h5 className="d-flex align-items-end">
              Hey {authenticated ? user.name : "Anonymous"} welcome to the Wall{" "}
            </h5>
            {authenticated ? (
              <i
                className="bi bi-box-arrow-in-left btn-lg"
                type="button"
                onClick={() => handleLogout()}
              />
            ) : (
              <i
                className="bi bi-box-arrow-in-right btn-lg"
                type="button"
                onClick={() => redirect("/")}
              />
            )}
          </nav>
        </header>
        <section className="d-flex flex-column align-items-center">
          <div className="col-sm-12">
            <div className="d-flex justify-content-center">
              <div>
                <h1>The Wall</h1>
                {authenticated ? (
                  <div>
                    <button
                      disabled={!filterUserPosts}
                      className="btn btn-secondary btn-sm"
                      type="button"
                      onClick={() => setFilterUserPosts(!filterUserPosts)}
                    >
                      All Posts
                    </button>
                    <button
                      disabled={filterUserPosts}
                      className="btn btn-secondary btn-sm"
                      type="button"
                      onClick={() => setFilterUserPosts(!filterUserPosts)}
                    >
                      My Posts
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <br />
            {authenticated ? (
              <div className="d-flex justify-content-center">
                <div className="shadow-lg p-3 mb-5 bg-body rounded col-sm-8">
                  <CreatePost user={user} getPosts={getPosts} />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-sm-8">
            <Posts
              posts={filterUserPosts ? filteredPosts : posts}
              user={user}
              getPosts={getPosts}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Wall;
