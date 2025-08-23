import { createContext } from "react";
import { type UseMutationResult } from "@tanstack/react-query";
import { User } from "../types";

export default createContext<{
  user: User | null;
  signIn: UseMutationResult<
    { access: string; refresh: string },
    Error,
    { username: string; password: string }
  >;
  signOut: VoidFunction;
}>({
  user: null,
  signIn: null!,
  signOut: () => null,
});
