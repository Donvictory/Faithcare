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
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${baseUrl}/login`, {
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

export async function signUpOrg({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${baseUrl}/login`, {
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
    const response = await fetch(`${baseUrl}/logout`);

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
