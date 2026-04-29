import { apiRequest } from "./helper";

export async function completeIndividualOnboarding(payload: any) {
  try {
    const response = await apiRequest("/users/metadata", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to save individual metadata");
    return {
      success: true,
      data: data?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getMetadataById(id: string) {
  try {
    const response = await apiRequest(`/users/metadata/${id}`);
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch metadata");
    return {
      success: true,
      data: data?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateIndividualMetadata(id: string, payload: any) {
  try {
    const response = await apiRequest(`/users/metadata/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to update metadata");
    return {
      success: true,
      data: data?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteIndividualMetadata(id: string) {
  try {
    const response = await apiRequest(`/users/metadata/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete metadata");
    }
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateUserChurch(payload: {
  organization?: string;
  churchName?: string;
}) {
  try {
    const response = await apiRequest("/users/metadata/me/church", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to update church affiliation");
    return {
      success: true,
      data: data?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getMetadataByUserId(userId: string) {
  try {
    const response = await apiRequest(`/users/metadata/user/${userId}`);
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch user metadata");
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

export async function createJournalEntry(payload: {
  userId: string;
  title: string;
  scriptureReference: string;
  content: string;
}) {
  try {
    const response = await apiRequest("/journal/entries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to create journal entry");
    return {
      success: true,
      data: data?.data || data, // Fallback to full response
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getJournalEntries(params: {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}) {
  try {
    const response = await apiRequest("/journal/entries", {
      method: "GET",
      params: params as any,
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch journal entries");
    return {
      success: true,
      data: data?.data || data, // Fallback to full response
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateJournalEntry(
  id: string,
  payload: {
    userId: string;
    title: string;
    scriptureReference: string;
    content: string;
  },
) {
  try {
    const response = await apiRequest(`/journal/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to update journal entry");
    return {
      success: true,
      data: data?.data || data, // Fallback to full response
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteJournalEntry(id: string) {
  try {
    const response = await apiRequest(`/journal/entries/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete journal entry");
    }
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Focus Timer API Functions
export async function createTimerSession(payload: {
  userId: string;
  duration: number;
  status: string;
  currentProgress: number;
}) {
  try {
    const response = await apiRequest("/timer/sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok)
      throw new Error(data.message || "Failed to create timer session");
    return { success: true, data: data?.data || data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTimerSessions(userId: string) {
  try {
    const response = await apiRequest("/timer/sessions", {
      method: "GET",
      params: { userId },
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : [];
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch timer sessions");
    return { success: true, data: data?.data || data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTimerSession(
  id: string,
  payload: {
    userId: string;
    duration: number;
    status: string;
    currentProgress: number;
  },
) {
  try {
    const response = await apiRequest(`/timer/sessions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok)
      throw new Error(data.message || "Failed to update timer session");
    return { success: true, data: data?.data || data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function completeTimerSession(id: string) {
  try {
    const response = await apiRequest(`/timer/sessions/${id}/complete`, {
      method: "PATCH",
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok)
      throw new Error(data.message || "Failed to complete timer session");
    return { success: true, data: data?.data || data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getActiveTimerSession(userId: string) {
  try {
    const response = await apiRequest("/timer/sessions/active", {
      method: "GET",
      params: { userId },
    });
    const text = await response.text();
    if (!response.ok) {
      const data = text ? JSON.parse(text) : {};
      throw new Error(data.message || "Failed to fetch active session");
    }
    const data = text ? JSON.parse(text) : null;
    return { success: true, data: data?.data || data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTimerSession(id: string) {
  try {
    const response = await apiRequest(`/timer/sessions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete session");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
