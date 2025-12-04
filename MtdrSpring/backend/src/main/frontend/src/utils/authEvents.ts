// utils/authEvents.ts
// Event-based authentication state management for cross-component communication

type AuthEventType = 'logout' | 'sessionExpired';

type AuthEventListener = (reason?: string) => void;

class AuthEventEmitter {
  private listeners: Map<AuthEventType, Set<AuthEventListener>> = new Map();

  /**
   * Subscribe to an auth event
   */
  on(event: AuthEventType, listener: AuthEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  /**
   * Emit an auth event to all listeners
   */
  emit(event: AuthEventType, reason?: string): void {
    this.listeners.get(event)?.forEach(listener => {
      try {
        listener(reason);
      } catch (error) {
        console.error(`Error in auth event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Clear all auth data from storage and emit logout event
   */
  invalidateSession(reason: string = 'Session expired'): void {
    // Clear storage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');

    // Emit events
    this.emit('sessionExpired', reason);
    this.emit('logout', reason);
  }
}

// Singleton instance
export const authEvents = new AuthEventEmitter();
