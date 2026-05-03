import { apiRequest } from "./helper";

export async function getTodayScripture() {
  try {
    const response = await apiRequest("/scripture/global/today", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Scripture API Error Response:", data);
      throw new Error(
        data.message || `Failed to fetch scripture (${response.status})`,
      );
    }
    return {
      success: true,
      data: data?.data || data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
