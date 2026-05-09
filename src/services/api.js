const API_BASE_URL =
  "http://192.168.1.6:5000";

/**
 * API Request Helper
 */
const apiRequest = async ({
  endpoint,
  method = "GET",
  body,
  token,
}) => {
  const headers = {
    "Content-Type":
      "application/json",
  };

  /**
   * Auth token
   */
  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method,
        headers,
        body: body
          ? JSON.stringify(body)
          : undefined,
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "API request failed"
    );
  }

  return data;
};

module.exports = {
  apiRequest,
};