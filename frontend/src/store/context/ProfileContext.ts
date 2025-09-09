import { createContext } from "react";
import type { User } from "../types/auth";

export default createContext<{ me: User }>({ me: null! });
