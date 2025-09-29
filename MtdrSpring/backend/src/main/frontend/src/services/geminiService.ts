// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

declare interface GeminiServiceInterface {
  isAvailable(): boolean;
  getModelInfo?(): unknown;
  sendMessage(input: string, messages: string[]): Promise<string>;
}

class GeminiService {
  private apiKey: string | undefined;
  private genAI: GoogleGenerativeAI | null;
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null;

  constructor() {
    // REACT_APP_GEMINI_API_KEY=tu_api_key_aqui
    this.apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;

    if (!this.apiKey) {
      console.error(
        "⚠️ REACT_APP_GEMINI_API_KEY no está configurada en las variables de entorno"
      );
    }

    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.model = null;

    if (this.genAI) {
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  async sendMessage(input: string, messages: string[]): Promise<string> {
    if (!this.model) {
      throw new Error(
        "Gemini no está configurado correctamente. Verifica tu API key."
      );
    }

    try {
      // Si hay historial de chat, usar chat para mantener contexto
      if (messages.length > 0) {
        const chat = this.model.startChat({
          history: this.formatChatHistory(
            messages.map((msg, idx) => ({
              role: idx % 2 === 0 ? "user" : "model",
              content: [{ text: msg }],
            }))
          ),
        });

        const result = await chat.sendMessage(input);
        const response = await result.response;
        return response.text();
      } else {
        // Si no hay historial, enviar mensaje simple
        const result = await this.model.generateContent(input);
        const response = await result.response;
        return response.text();
      }
    } catch (error) {
      console.error("Error al comunicarse con Gemini:", error);

      // Manejar diferentes tipos de errores
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        const message = (error as { message: string }).message;
        if (message.includes("API_KEY_INVALID")) {
          throw new Error("API key de Gemini inválida");
        } else if (message.includes("QUOTA_EXCEEDED")) {
          throw new Error("Cuota de Gemini excedida");
        } else if (message.includes("RATE_LIMIT_EXCEEDED")) {
          throw new Error(
            "Límite de velocidad excedido. Intenta de nuevo en un momento."
          );
        }
      }
      throw new Error("Error al procesar tu mensaje. Intenta de nuevo.");
    }
  }

  // Formatear el historial del chat para Gemini
  formatChatHistory(messages: { role: string; content: { text: string }[] }[]) {
    return messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content.map((block) => block.text).join("\n") }],
    }));
  }

  // Método para verificar si el servicio está disponible
  isAvailable() {
    return this.model !== null;
  }

  // Método para obtener información del modelo
  getModelInfo() {
    return {
      model: "gemini-1.5-flash",
      available: this.isAvailable(),
      apiKeyConfigured: !!this.apiKey,
    };
  }
}

// Exportar una instancia singleton
export const geminiService: GeminiServiceInterface = new GeminiService();
export default geminiService;
