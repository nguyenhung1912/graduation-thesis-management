export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

export const httpClient = {
  async request(url, options = {}) {
    const {
      timeout = DEFAULT_TIMEOUT_MS,
      headers = {},
      ...customOptions
    } = options;
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
        throw new ApiError(response.status, finalMessage, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError(0, "Yêu cầu hết thời gian chờ (Timeout).", error);
      }

      throw new ApiError(
        0,
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại dịch vụ.",
        error,
      );
    }
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

  delete(url, options = {}) {
    return this.request(url, { ...options, method: "DELETE" });
  },
};
