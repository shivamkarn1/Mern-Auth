import axios from "axios";
import { UNAUTHORIZED } from "../constants/http";
import { navigate } from "../lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

// create separate client for refreshing the access token
// to avoid infinite loops with the error interceptor

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response || {};

    // try to refresh access token behind the scene
    if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
      try {
        // refresh the access token , then retry the original request
        await TokenRefreshClient.get("/auth/refresh");
        return TokenRefreshClient(config);
      } catch (error) {
        // handle refresh errors by redirecting to login
        // Don't clear cache to avoid logging out on page refresh
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      }
    }
    return Promise.reject(error);
  }
);

export default API;
