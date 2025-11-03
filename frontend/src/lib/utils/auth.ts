/**
 * Helper function to get auth token from Redux Persist storage
 * This is useful for places outside React context (like axios interceptors)
 */
export const getAuthTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const persistedState = localStorage.getItem("persist:root");
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      const authState = parsed.auth ? JSON.parse(parsed.auth) : null;
      return authState?.token || null;
    }
  } catch (error) {
    console.warn("Failed to parse persisted state:", error);
  }

  return null;
};

