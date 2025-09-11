import { createContext } from "react";
import type { Credentials, User } from "../types/account";

export default createContext<{
  me: User | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  me: null,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
