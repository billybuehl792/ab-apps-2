import { createContext } from "react";
import type { User } from "../types";

export default createContext<{
  me: User;
}>({
  me: null!,
});
