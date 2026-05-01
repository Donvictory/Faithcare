import { baseUrl } from "@/constants/api";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

let inMemoryToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function setInMemoryToken(token: string | null) {
  inMemoryToken = token;
}

export function getInMemoryToken() {
  return inMemoryToken;
}

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRrefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiRequest(
  endpoint: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { params, headers, ...rest } = options;

  // Build URL with query params
  let url = `${baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Strictly use in-memory token to ensure security
  const token = inMemoryToken;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const config: RequestInit = {
    ...rest,
    headers: defaultHeaders,
    credentials: "include", // Ensure cookies are sent with all requests
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
            credentials: "include",
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            const newToken = data.data.accessToken;

            // Update memory token
            setInMemoryToken(newToken);
            
            // Note: We'll let AuthProvider handle the persistent user state, 
            // but we update the in-memory token here for the retry.

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
            // Clear memory on failure
            setInMemoryToken(null);
            
            // We don't force a redirect here; let the component/hook handle it
            // or AuthProvider will pick up the 401 via some other means
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
