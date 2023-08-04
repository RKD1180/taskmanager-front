import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Global function to make API requests
export const apiRequest = async (
  method,
  endpoint,
  data = null,
  headers = {}
) => {
  data = JSON.stringify(data);
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    // If login fails, check the status code and throw a custom error
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      throw new Error(error);
    } else {
      // If there's any other error, rethrow it to be handled elsewhere
      throw error;
    }
  }
};
