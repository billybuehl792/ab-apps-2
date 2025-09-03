import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { User } from "../types";

const me = () => api.get<User>(endpoints.auth.me());

export const authApi = {
  me,
};
