export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // RFC 7807 Problem Details properties
    this.title =
      (details && typeof details === "object" && details.title) ||
      ApiError.getDefaultTitleForStatus(status);
    this.detail =
      (details &&
        typeof details === "object" &&
        (details.detail || details.message)) ||
      message;
    this.type =
      (details && typeof details === "object" && details.type) ||
      `urn:problem-type:http-${status || "network-error"}`;
    this.instance =
      details && typeof details === "object" && details.instance
        ? details.instance
        : null;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isServerError() {
    return this.status >= 500 && this.status < 600;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  static getDefaultTitleForStatus(status) {
    switch (status) {
      case 0:
        return "Network Failure";
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 409:
        return "Conflict";
      case 500:
        return "Internal Server Error";
      case 502:
        return "Bad Gateway";
      case 503:
        return "Service Unavailable";
      case 504:
        return "Gateway Timeout";
      default:
        return status >= 500
          ? "Server Error"
          : status >= 400
            ? "Client Error"
            : "HTTP Error";
    }
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

export const httpClient = {
  async request(url, options = {}) {
    const {
      timeout = DEFAULT_TIMEOUT_MS,
      headers = {},
      retries = 0,
      retryDelay = 100,
      backoffFactor = 2,
      ...customOptions
    } = options;

    let lastError = null;
    const maxAttempts = Math.max(0, retries) + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const mergedHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      };

      try {
        const response = await fetch(url, {
          ...customOptions,
          headers: mergedHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 204) {
          return null;
        }

        const contentType = response.headers.get("content-type") || "";
        let data = null;
        if (contentType.includes("application/json")) {
          try {
            data = await response.json();
          } catch {
            data = null;
          }
        } else {
          const text = await response.text();
          data = text ? { message: text } : null;
        }

        if (!response.ok) {
          let errorMessage;
          if (typeof data === "object" && data !== null) {
            if (typeof data.message === "string") {
              errorMessage = data.message;
            } else if (typeof data.error === "string") {
              errorMessage = data.error;
            }
          }
          const finalMessage =
            errorMessage || `Yêu cầu thất bại với mã lỗi ${response.status}`;
          const error = new ApiError(response.status, finalMessage, data);

          // Check if status is a retryable server error (502, 503, 504)
          const isRetryableStatus = [502, 503, 504].includes(response.status);
          if (isRetryableStatus && attempt < maxAttempts - 1) {
            lastError = error;
            await new Promise((resolve) =>
              setTimeout(
                resolve,
                retryDelay * Math.pow(backoffFactor, attempt),
              ),
            );
            continue;
          }

          throw error;
        }

        return data;
      } catch (error) {
        clearTimeout(timeoutId);

        let normalizedError = error;
        if (!(error instanceof ApiError)) {
          if (error instanceof Error && error.name === "AbortError") {
            normalizedError = new ApiError(
              0,
              "Yêu cầu hết thời gian chờ (Timeout).",
              error,
            );
          } else {
            normalizedError = new ApiError(
              0,
              "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại dịch vụ.",
              error,
            );
          }
        }

        const isAbort = error instanceof Error && error.name === "AbortError";
        const isRetryableNetwork = normalizedError.status === 0 && !isAbort;

        if (isRetryableNetwork && attempt < maxAttempts - 1) {
          lastError = normalizedError;
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(backoffFactor, attempt)),
          );
          continue;
        }

        throw normalizedError;
      }
    }

    throw lastError;
  },

  get(url, options = {}) {
    return this.request(url, { ...options, method: "GET" });
  },


  post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete(url, options = {}) {
    return this.request(url, { ...options, method: "DELETE" });
  },
};
