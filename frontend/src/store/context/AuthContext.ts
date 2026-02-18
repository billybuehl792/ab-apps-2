import { createContext } from "react";
import type { TCredentials, TUser } from "../types/account";

export default createContext<{
  me: TUser | null;
  signIn: (credentials: TCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  me: null,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
