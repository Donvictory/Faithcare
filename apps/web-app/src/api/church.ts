import { apiRequest, getInMemoryToken } from "./helper";

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
    console.log("[getFirstTimers] filters sent:", params, "| response:", data);
    return {
      success: true,
      data: data,
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

export async function updateFirstTimerVisitType(
  organizationId: string,
  id: string,
  payload: any,
) {
  console.log("[updateFirstTimerVisitType] Promoting id:", id, "to second timer");
  try {
    const today = new Date().toISOString().split("T")[0];
    
    // 1. Create the new "Second Timer" record
    // We send both camelCase and snake_case to be safe
    const updatePayload = { 
      ...payload,
      organizationId,
      firstTimerId: id,
      visitType: "second_time",
      visit_type: "second_time",
      serviceDate: today,
    };
    delete updatePayload.id;
    delete updatePayload._id;

    const createRes = await apiRequest(
      `/church/first-timers`,
      {
        method: "POST",
        body: JSON.stringify(updatePayload),
      },
    );
    
    if (!createRes.ok) {
      const errorData = await createRes.json();
      throw new Error(errorData.message || `Failed to create second timer record`);
    }

    // 2. Mark the old record as "PROMOTED" to hide it from the First Timers list
    // Use the established updateFirstTimerStatus function for consistency
    console.log("[updateFirstTimerVisitType] Marking old record as PROMOTED:", id);
    await updateFirstTimerStatus(id, { 
      status: "PROMOTED", 
      notes: "Promoted to second timer" 
    });

    // 3. Attempt to delete the old record as a final cleanup
    await deleteFirstTimer(organizationId, id);

    return { success: true };
  } catch (error: any) {
    console.error("[updateFirstTimerVisitType] Error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteFirstTimer(organizationId: string, id: string) {
  console.log(`[deleteFirstTimer] Attempting delete for ID: ${id}`);
  try {
    // Attempt 1: Standard Organizational Path
    const res1 = await apiRequest(`/organizations/${organizationId}/first-timers/${id}`, { method: "DELETE" });
    if (res1.ok) {
      console.log("[deleteFirstTimer] Path 1 Success");
      return { success: true };
    }

    // Attempt 2: Root Church Path
    const res2 = await apiRequest(`/church/first-timers/${id}`, { method: "DELETE" });
    if (res2.ok) {
      console.log("[deleteFirstTimer] Path 2 Success");
      return { success: true };
    }

    // Attempt 3: General Members Path (some backends use this)
    const res3 = await apiRequest(`/organizations/${organizationId}/members/${id}`, { method: "DELETE" });
    if (res3.ok) {
      console.log("[deleteFirstTimer] Path 3 Success");
      return { success: true };
    }

    throw new Error(`Deletion failed across all known paths (Status codes: ${res1.status}, ${res2.status}, ${res3.status})`);
  } catch (error: any) {
    console.error("[deleteFirstTimer] Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getFollowUps(organizationId: string) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/follow-ups`,
    );
    const raw = await response.json();
    if (!response.ok) throw new Error(raw.message || "Failed to fetch follow-ups");
    // Return the full raw response — the UI layer will find the array
    console.log("[getFollowUps] Raw server response:", raw);
    return raw;
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
    [key: string]: any;
  },
) {
  const response = await apiRequest(
    `/organizations/${organizationId}/follow-ups`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.message || data.error || "Failed to create follow-up");

  return {
    success: true,
    data: data?.data,
  };
}

export async function updateFollowUp(
  organizationId: string,
  id: string,
  payload: any,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/follow-ups/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to update follow-up");
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

export async function deleteFollowUp(organizationId: string, id: string) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/follow-ups/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete follow-up");
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

export async function getFollowUpsByMember(
  organizationId: string,
  newMemberId: string,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/follow-ups/member/${newMemberId}`,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch member follow-ups");
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
export async function getPrayerRequests(organizationId: string) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/prayer-requests`,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch prayer requests");
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

export async function getPrayerRequestById(
  organizationId: string,
  id: string,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/prayer-requests/${id}`,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch prayer request details");
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

export async function updatePrayerRequest(
  organizationId: string,
  id: string,
  payload: any,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/prayer-requests/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update prayer request");
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

export async function deletePrayerRequest(
  organizationId: string,
  id: string,
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/prayer-requests/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete prayer request");
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

// Organization Management Endpoints
export async function createOrganization(payload: any) {
  try {
    const response = await apiRequest("/organizations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create organization");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrganization(id: string, payload: any) {
  try {
    const response = await apiRequest(`/organizations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update organization");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteOrganization(id: string) {
  try {
    const response = await apiRequest(`/organizations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete organization");
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOrganizationById(id: string) {
  try {
    const response = await apiRequest(`/organizations/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch organization");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function regenerateOrganizationQrCode(id: string) {
  try {
    const response = await apiRequest(`/organizations/${id}/qr-code/regenerate`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to regenerate QR code");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMyOrganization() {
  try {
    const response = await apiRequest(`/organizations/mine`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch your organization");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const response = await apiRequest(`/organizations`, {
      params: { slug }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch organization by slug");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function getSalvationRecords(organizationId: string) {
  try {
    const response = await apiRequest(`/organizations/${organizationId}/salvation-records`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch salvation records");
    return { success: true, data: data?.data || data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSalvationRecord(organizationId: string, payload: any) {
  try {
    const response = await apiRequest(`/organizations/${organizationId}/salvation-records`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create salvation record");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPrayerRequest(organizationId: string, payload: any) {
  try {
    const response = await apiRequest(`/organizations/${organizationId}/prayer-requests`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create prayer request");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bulkUploadMembers(organizationId: string, type: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    // Using fetch directly for multipart/form-data as apiRequest might be configured for JSON
    const baseUrl = import.meta.env.VITE_API_URL || "https://faithcare-13a2dc003ee9.herokuapp.com/api/v1";
    const token = getInMemoryToken();

    const response = await fetch(`${baseUrl}/organizations/${organizationId}/bulk-upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Bulk upload failed");
    return { success: true, data: data?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function sendBulkMessage(
  organizationId: string,
  payload: {
    platform: "whatsapp" | "sms";
    content: string;
    recipientIds: string[];
  },
) {
  try {
    const response = await apiRequest(
      `/organizations/${organizationId}/messages/bulk`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send bulk messages");
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
