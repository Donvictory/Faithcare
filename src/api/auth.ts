import { baseUrl } from "@/constants/api";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      //   credentials: "include",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);

    if (!response.ok) throw new Error(data.message || "Invalid credentials");
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
    const response = await fetch(`${baseUrl}/auth/register/user`, {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, phoneNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Fetch failed");
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
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${baseUrl}/auth/register/admin`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Fetch failed");
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
    const response = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Fetch failed");
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
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

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
    const response = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${baseUrl}/auth/resend-otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to resend OTP");
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

