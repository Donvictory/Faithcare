import { baseUrl } from "@/constants/api";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRrefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiRequest(endpoint: string, options: RequestOptions = {}): Promise<Response> {
  const { params, headers, ...rest } = options;

  // Build URL with query params
  let url = `${baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Get token from storage
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const config: RequestInit = {
    ...rest,
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // In many setups, the refresh token is in a cookie, so we need credentials: "include"
            credentials: "include",
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            const newToken = data.data.accessToken;
            
            // Store new token
            if (localStorage.getItem("accessToken")) {
              localStorage.setItem("accessToken", newToken);
            } else {
              sessionStorage.setItem("accessToken", newToken);
            }

            onRrefreshed(newToken);
            isRefreshing = false;

            // Retry original request
            const retryHeaders = {
              ...defaultHeaders,
              Authorization: `Bearer ${newToken}`,
            };
            return fetch(url, { ...config, headers: retryHeaders });
          } else {
            isRefreshing = false;
            // Handle refresh failure (e.g., logout)
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");
            window.location.href = "/";
            return response;
          }
        } catch (error) {
          isRefreshing = false;
          return response;
        }
      }

      // If already refreshing, wait for it
      return new Promise<Response>((resolve) => {
        subscribeTokenRefresh((newToken) => {
          const retryHeaders = {
            ...defaultHeaders,
            Authorization: `Bearer ${newToken}`,
          };
          resolve(fetch(url, { ...config, headers: retryHeaders }));
        });
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
}
