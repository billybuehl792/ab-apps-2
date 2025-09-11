import { createContext } from "react";
import type { User } from "../types/account";

export default createContext<{ me: User }>({ me: null! });
