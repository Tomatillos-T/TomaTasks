// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // REACT_APP_GEMINI_API_KEY=tu_api_key_aqui
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('⚠️ REACT_APP_GEMINI_API_KEY no está configurada en las variables de entorno');
    }
    
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.model = null;
    
    if (this.genAI) {

      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async sendMessage(message, chatHistory = []) {
    if (!this.model) {
      throw new Error('Gemini no está configurado correctamente. Verifica tu API key.');
    }

    try {
      // Si hay historial de chat, usar chat para mantener contexto
      if (chatHistory.length > 0) {
        const chat = this.model.startChat({
          history: this.formatChatHistory(chatHistory),
        });
        
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      } else {
        // Si no hay historial, enviar mensaje simple
        const result = await this.model.generateContent(message);
        const response = await result.response;
        return response.text();
      }
    } catch (error) {
      console.error('Error al comunicarse con Gemini:', error);
      
      // Manejar diferentes tipos de errores
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('API key de Gemini inválida');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('Cuota de Gemini excedida');
      } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
        throw new Error('Límite de velocidad excedido. Intenta de nuevo en un momento.');
      } else {
        throw new Error('Error al procesar tu mensaje. Intenta de nuevo.');
      }
    }
  }

  // Formatear el historial del chat para Gemini
  formatChatHistory(messages) {
    return messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content.map(block => block.text).join('\n') }]
    }));
  }

  // Método para verificar si el servicio está disponible
  isAvailable() {
    return this.model !== null;
  }

  // Método para obtener información del modelo
  getModelInfo() {
    return {
      model: 'gemini-1.5-flash',
      available: this.isAvailable(),
      apiKeyConfigured: !!this.apiKey
    };
  }
}

// Exportar una instancia singleton
export const geminiService = new GeminiService();
export default geminiService;