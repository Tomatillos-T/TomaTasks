// services/httpClient.ts

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

interface HttpOptions extends RequestInit {
  /** Indica si se debe incluir el token JWT automáticamente */
  auth?: boolean;
  /** Headers adicionales opcionales */
  headers?: HeadersInit;
}

export interface HttpError {
  message: string;
  status: number;
}

export class HttpClient {
  /**
   * Obtiene el token JWT desde localStorage
   */
  private static getToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  /**
   * Construye los headers para la solicitud
   * @param auth Si es `true`, agrega el header Authorization con el token
   */
  private static getHeaders(auth: boolean, headers?: HeadersInit): HeadersInit {
    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...((headers as Record<string, string>) || {}),
    };

    if (auth) {
      const token = this.getToken();
      if (token) {
        baseHeaders["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("Intentando hacer una solicitud protegida sin token.");
      }
    }

    return baseHeaders;
  }

  /**
   * Método principal de solicitud HTTP
   * @param endpoint Endpoint relativo (por ejemplo: /api/projects)
   * @param options Configuración de la solicitud
   */
static async request<T>(
  endpoint: string,
  options: HttpOptions = {}
): Promise<T> {
  const { auth = false, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: this.getHeaders(auth, headers),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Error en la solicitud: ${response.status}`;

    // Lanzar el error sin redirigir
    throw {
      message: errorMessage,
      status: response.status,
    } as HttpError;
  }

  if (response.status === 204) return {} as T;

  const text = await response.text();
  if(!text) return {} as T;
  return JSON.parse(text);
}


  /**
   * Atajo para solicitudes GET
   */
  static get<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * Atajo para solicitudes POST
   */
  static post<T>(
    endpoint: string,
    body?: unknown,
    options?: HttpOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Atajo para solicitudes PUT
   */
  static put<T>(
    endpoint: string,
    body?: unknown,
    options?: HttpOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Atajo para solicitudes DELETE
   */
  static delete<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
