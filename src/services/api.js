import "dotenv/config";
import axios from "axios";

const api = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_BASE_URL
});

const login = async (email, password) => {
  try {
    const { data, status } = await api.post("/user/login", { email, password });

    return { data, status };
  } catch (error) {
    return {
      data: error.response.data,
      status: error.response.status
    };
  }
};

const createUser = async (userData) => {
  try {
    const { data, status } = await api.post("/user/register", { ...userData });

    return { data, status };
  } catch (error) {
    return {
      data: error.response.data,
      status: error.response.status
    };
  }
};

const getPosts = async () => {
  try {
    const { data, status } = await api.get("/post");

    return { data, status };
  } catch (error) {
    return {
      data: error.response.data,
      status: error.response.status
    };
  }
};

const createPost = async (postData, token) => {
  try {
    const { data, status } = await api.post("/post", { ...postData }, { headers: { "Authorization": token } });

    return { data, status };
  } catch (error) {
    return {
      data: error.response.data,
      status: error.response.status
    };
  }
};

const editPost = async (postData, token, id) => {
  try {
    const { data, status } = await api.put(`/post/${id}`, { ...postData }, { headers: { "Authorization": token } });

    return { data, status };
  } catch (error) {
    return {
      data: error.response.data,
      status: error.response.status
    };
  }
};

const deletePost = async (id, token) => {
  try {
    const { data, status } = await api.delete(`/post/${id}`, { headers: { "Authorization": token } });

    return { data, status };
  } catch (error) {
    return {
      data: error.response.data,
      status: error.response.status
    };
  }
};

export default {
  login,
  createUser,
  getPosts,
  createPost,
  editPost,
  deletePost
};
