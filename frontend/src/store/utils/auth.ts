const getAccessToken = () => {
  return localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_NAME);
};

const getRefreshToken = () => {
  return localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_NAME);
};

const getTokens = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return { accessToken, refreshToken };
};

const setTokens = (data: { access?: string; refresh?: string }) => {
  if (data.access)
    localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_NAME, data.access);
  if (data.refresh)
    localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_NAME, data.refresh);
};

const revokeTokens = (token?: "access" | "refresh") => {
  if (!token || token === "access")
    localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_NAME);
  if (!token || token === "refresh")
    localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_NAME);
};

export const authUtils = {
  getAccessToken,
  getRefreshToken,
  getTokens,
  setTokens,
  revokeTokens,
};
