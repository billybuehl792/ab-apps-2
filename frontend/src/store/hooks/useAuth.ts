import { use } from "react";
import AuthContext from "../context/AuthContext";

const useAuth = () => use(AuthContext);

export default useAuth;
