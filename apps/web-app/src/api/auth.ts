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
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Essential for saving the refresh cookie
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Login failed");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
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
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Registration failed");
    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
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
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Registration failed");
    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function logout() {
  try {
    const response = await apiRequest("/auth/logout", {
      method: "POST",
    });

    if (response.status === 404) {
      return { success: true, status: 404 };
    }

    const data = await response.json();
    if (!response.ok) throw new Error("Logout failed");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function refreshToken() {
  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const status = response.status;
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Failed to refresh token");

    return {
      success: true,
      data,
      status,
    };
  } catch (error: any) {
    const isAuthError =
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.includes("401");
    return {
      success: false,
      error: error.message,
      status: isAuthError ? 401 : error.status || 500,
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
    const response = await fetch(`${baseUrl}/auth/verify-email`, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Verification failed");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function resendOTP({ email }: { email: string }) {
  try {
    const response = await fetch(`${baseUrl}/auth/resend-otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to resend OTP");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to send reset link");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function resetPassword(payload: any) {
  try {
    const response = await fetch(`${baseUrl}/auth/reset-password`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to reset password");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function changePassword(payload: any) {
  try {
    const response = await apiRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to change password");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function switchOrganization(organizationId: string) {
  try {
    const response = await apiRequest("/auth/switch-organization", {
      method: "POST",
      body: JSON.stringify({ organizationId }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to switch organization");

    return {
      success: true,
      data: data?.data || data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}

export async function googleSignIn(idToken: string) {
  try {
    const response = await fetch(`${baseUrl}/auth/google/signin`, {
      method: "POST",
      body: JSON.stringify({ idToken }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Google sign in failed");

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
}
