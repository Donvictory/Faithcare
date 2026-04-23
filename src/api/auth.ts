import { baseUrl } from "@/constants/api";
import { apiRequest } from "./helper";

export async function login({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  try {
    console.log(`[Login Request] ${baseUrl}/auth/login`);
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(`[Login Response] Status: ${response.status}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Invalid credentials");

    // Store rememberMe preference
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      if (data.data.accessToken)
        localStorage.setItem("accessToken", data.data.accessToken);
      if (data.data.user)
        localStorage.setItem("user", JSON.stringify(data.data.user));
    } else {
      localStorage.removeItem("rememberMe");
      if (data.data.accessToken)
        sessionStorage.setItem("accessToken", data.data.accessToken);
      if (data.data.user)
        sessionStorage.setItem("user", JSON.stringify(data.data.user));
    }

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

export async function signUpUser({
  email,
  password,
  fullName,
  phoneNumber,
}: {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}) {
  try {
    const response = await apiRequest("/auth/register/user", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Registration failed");
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function signUpOrg({
  email,
  password,
  fullName,
  phoneNumber,
}: {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}) {
  try {
    const response = await apiRequest("/auth/register/admin", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Registration failed");
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function logout() {
  try {
    const response = await apiRequest("/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // If it's a 404, the backend might not have the endpoint,
    // but we still want to clear local state.
    if (response.status === 404) {
      return { success: true, status: 404 };
    }

    const data = await response.json();
    if (!response.ok) throw new Error("Logout failed");

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function refreshToken() {
  try {
    // console.log(`[Refresh Token Request] ${baseUrl}/auth/refresh`);
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    // console.log(`[Refresh Token Response] Status: ${response.status}`);
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Failed to refresh token");
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function verifyOTP({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  try {
    const response = await apiRequest("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Invalid OTP");
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function resendOTP(email: string) {
  try {
    const response = await apiRequest("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email, type: "email_verification" }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to resend OTP");
    }
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function switchOrganization(organizationId: string) {
  try {
    const response = await apiRequest(
      `/auth/switch-organization/${organizationId}`,
      {
        method: "POST",
      },
    );

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Failed to switch organization");
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
