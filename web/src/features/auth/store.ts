import { create } from 'zustand'
import type { Me } from './api';

type AuthStore = {
  accessToken: string;
  me: Me
}

export const useAuth = create<AuthStore>(() => ({
  accessToken: "",
  me: {
    id: Infinity,
    email: "",
    firstName: "",
    lastName: "",
  }
}))
