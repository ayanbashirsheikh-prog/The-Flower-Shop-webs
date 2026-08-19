const API_URL =
  "http://localhost:5000/api";

export const getAdminDashboard =
  async (token) => {
    const response = await fetch(
      `${API_URL}/admin/dashboard`,
      {
        method: "GET",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to load dashboard"
      );
    }

    return data;
  };