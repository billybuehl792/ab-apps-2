import { createContext } from "react";
import type { TUser } from "../types/account";

export default createContext<{ me: TUser }>({ me: null! });
