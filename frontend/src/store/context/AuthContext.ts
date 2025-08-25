import { createContext } from "react";
import type { Credentials, User } from "../types";

export default createContext<{
  user: User | null;
  signIn: (
    credentials: Credentials,
    options?: {
      onSuccess?: (user: User) => void;
      onError?: (error: Error) => void;
    }
  ) => Promise<User>;
  signOut: VoidFunction;
}>({
  user: null,
  signIn: null!,
  signOut: () => null,
});
