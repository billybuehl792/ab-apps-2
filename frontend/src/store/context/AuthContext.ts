import { createContext } from "react";
import type { ICredentials, IUser } from "../types/account";

export default createContext<{
  me: IUser | null;
  signIn: (credentials: ICredentials) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  me: null,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
