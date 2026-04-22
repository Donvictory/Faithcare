import { apiRequest } from "./helper";

export async function getDashboardTrends(organizationId: string) {
  try {
    const response = await apiRequest(
      `/church/dashboard/trends`,
      {
        params: { organizationId }
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch dashboard trends");
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

export async function getFirstTimers(
  filters: {
    organizationId?: string;
    page?: number;
    limit?: number;
    status?: "PENDING" | "CONTACTED" | "FOLLOWED_UP" | "all";
    visit_type?: "first_time" | "second_time";
    search?: string;
    from_date?: string;
    to_date?: string;
  } = {},
) {
  try {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params[key] = value.toString();
    });

    const response = await apiRequest(
      "/church/first-timers",
      { params },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch first timers");
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

export async function createFirstTimer(payload: any) {
  try {
    const response = await apiRequest("/church/first-timers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to create first timer");
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

export async function getFirstTimerById(id: string) {
  try {
    const response = await apiRequest(`/church/first-timers/${id}`);
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch first timer details");
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

export async function updateFirstTimerStatus(
  id: string,
  payload: { status: string; notes: string },
) {
  try {
    const response = await apiRequest(
      `/church/first-timers/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update status");
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

export async function getFollowUps(organizationId: string) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/follow-ups`,
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch follow-ups");
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

export async function createFollowUp(
  organizationId: string,
  payload: {
    newMemberId: string;
    name: string;
    tags: string[];
    priority: "HIGH" | "MEDIUM" | "LOW";
    description: string;
    dueDate: string;
  },
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/follow-ups`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Failed to create follow-up");
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

export async function completeOrganizationOnboarding(
  payload: {
    name: string;
    slug: string;
    email: string;
    denomination: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    websiteUrl: string;
    memberCountRange: string;
    organizationRole: string;
  },
) {
  try {
    const response = await apiRequest("/organizations", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Failed to complete onboarding");
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

export async function getCommunities(organizationId: string) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/communities`,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch communities");
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

export async function createCommunity(
  organizationId: string,
  payload: any,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/communities`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to create community");
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

export async function updateCommunity(
  organizationId: string,
  id: string,
  payload: any,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/communities/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to update community");
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

export async function deleteCommunity(
  organizationId: string,
  id: string,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/communities/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete community");
    }
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
