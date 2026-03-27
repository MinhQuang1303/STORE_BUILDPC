import axios from "axios";

const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const apiBase = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;
const API_URL = `${apiBase}/chat`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? { Authorization: `Bearer ${user.token}` } : {};
};

export const sendChat = (message) => {
  return axios.post(API_URL, { message }, { headers: getAuthHeader() });
};

