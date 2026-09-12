
export const API_BASE = "http://127.0.0.1:8000";

export const getAccessToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refresh");

export function saveTokens({ access, refresh }) {
  if (access) localStorage.setItem("token", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  saveTokens(data);
  return data.access || null;
}

export async function apiFetch(path, options = {}) {
  const send = (token) => {
    const headers = { ...(options.headers || {}) };
    // FormData must set its own multipart Content-Type (it carries the
    // boundary), so only default to JSON for plain bodies.
    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;
    if (options.body && !isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API_BASE}${path}`, { ...options, headers });
  };

  let response = await send(getAccessToken());

  // Expired or missing access token: refresh once, then replay the request.
  if (response.status === 401) {
    const freshToken = await refreshAccessToken();
    if (freshToken) response = await send(freshToken);
  }

  return response;
}

/**
 * Turn a failed DRF response into something worth showing the user, instead of
 * a blanket "Update Failed" that hides the real reason.
 */
export async function getErrorMessage(response) {
  if (response.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (response.status === 403) {
    return "This account is not an admin, so it cannot change the menu.";
  }

  try {
    const data = await response.json();
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    // Field level validation errors, e.g. {"price": ["A valid number is required."]}
    const fieldErrors = Object.entries(data)
      .map(([field, errors]) => `${field}: ${[].concat(errors).join(" ")}`)
      .join("\n");
    if (fieldErrors) return fieldErrors;
  } catch {
    // Response had no JSON body; fall through to the generic message.
  }

  return `Request failed (HTTP ${response.status}).`;
}
