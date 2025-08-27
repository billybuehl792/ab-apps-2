let accessToken: string | null = null;

const getAccessToken = () => accessToken;

const setAccessToken = (token?: string | null) => {
  accessToken = token ?? null;
};

export const authUtils = {
  getAccessToken,
  setAccessToken,
};
