import { createContext } from "react";
import type { Credentials } from "../types/auth";

export default createContext<{
  isAuthenticated: boolean;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  isAuthenticated: false,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
