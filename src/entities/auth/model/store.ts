import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  setToken: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
}

// Кастомный storage, который выбирает localStorage или sessionStorage в зависимости от rememberMe
const createCustomStorage = () => {
  return {
    getItem: (name: string): string | null => {
      // Сначала проверяем localStorage (для rememberMe=true)
      const localStorageData = localStorage.getItem(name);
      if (localStorageData) {
        try {
          const parsed = JSON.parse(localStorageData);
          if (parsed?.state?.rememberMe) {
            return localStorageData;
          }
        } catch {
          // ignore
        }
      }
      
      // Затем проверяем sessionStorage (для rememberMe=false)
      const sessionStorageData = sessionStorage.getItem(name);
      if (sessionStorageData) {
        return sessionStorageData;
      }
      
      return null;
    },
    setItem: (name: string, value: string) => {
      try {
        const parsed = JSON.parse(value);
        const rememberMe = parsed?.state?.rememberMe;
        
        // Очищаем оба хранилища перед сохранением
        localStorage.removeItem(name);
        sessionStorage.removeItem(name);
        
        if (rememberMe) {
          localStorage.setItem(name, value);
        } else {
          sessionStorage.setItem(name, value);
        }
      } catch {
        // Если не удалось распарсить, сохраняем в sessionStorage по умолчанию
        sessionStorage.setItem(name, value);
      }
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
    },
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      rememberMe: false,
      setToken: (token: string, rememberMe: boolean = false) => {
        set({ token, isAuthenticated: true, rememberMe });
      },
      logout: () => set({ token: null, isAuthenticated: false, rememberMe: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createCustomStorage()),
    }
  )
);
