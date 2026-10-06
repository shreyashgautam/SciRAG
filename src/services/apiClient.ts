/**
 * SciRAG API Client
 * Unified HTTP client connecting the React frontend to the backend /api/v1 routes.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    const token = localStorage.getItem('scirag_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleError(res: Response): Promise<never> {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && data.detail) {
        message = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      } else if (data && data.message) {
        message = data.message;
      }
    } catch {
      try {
        const text = await res.text();
        if (text) message = text;
      } catch {
        // fallback
      }
    }
    throw new Error(message);
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      return this.handleError(res);
    }
    return res.json();
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      return this.handleError(res);
    }
    return res.json();
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers = this.getHeaders();
    delete headers['Content-Type']; // Let browser set boundary for multipart/form-data
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      return this.handleError(res);
    }
    return res.json();
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return this.handleError(res);
    }
    return res.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      return this.handleError(res);
    }
    return res.json();
  }
}

export const apiClient = new ApiClient();
