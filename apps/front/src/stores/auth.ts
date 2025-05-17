import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware/persist";

type AuthState = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            setAccessToken: (token) => set({accessToken: token}),
            clearToken: () => set({accessToken: null})
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)