let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: typeof accessToken) => {
  accessToken = token ?? null;
};
