import {
  type ContextType,
  useEffect,
  useState,
  type PropsWithChildren,
  useCallback,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircularProgress, Typography } from "@mui/material";
import AuthContext from "@/store/context/AuthContext";
import FullScreen from "@/components/layout/FullScreen";
import { authUtils } from "@/store/utils/auth";
import { authQueries } from "@/store/queries/auth";
import { authMutations } from "@/store/mutations/auth";
import { queryUtils } from "@/store/utils/queries";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] =
    useState<ContextType<typeof AuthContext>["user"]>(null);
  const [loading, setLoading] = useState(false);

  /** Values */

  const queryClient = useQueryClient();

  /** Mutations */

  const setTokensMutation = useMutation(authMutations.setTokens());

  /** Callbacks */

  const signOut: ContextType<typeof AuthContext>["signOut"] =
    useCallback(() => {
      authUtils.revokeTokens();
      setUser(null);
      queryClient.clear();
    }, [queryClient]);

  const handleFetchMeUser = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = authUtils.getAccessToken();
      if (!authToken) throw new Error("User is not authenticated");

      const user = await queryClient.fetchQuery(authQueries.me());
      setUser(user);
      await queryUtils.delay(300);

      return user;
    } catch (error) {
      signOut();
      throw error as Error;
    } finally {
      setLoading(false);
    }
  }, [queryClient, signOut]);

  const signIn: ContextType<typeof AuthContext>["signIn"] = async (
    credentials,
    options
  ) => {
    try {
      await setTokensMutation.mutateAsync(credentials);
      return await handleFetchMeUser();
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  };

  /** Effects */

  useEffect(() => {
    handleFetchMeUser();
  }, [handleFetchMeUser]);

  return (
    <AuthContext value={{ user, signIn, signOut }}>
      {loading ? (
        <FullScreen>
          <CircularProgress color="inherit" />
          <Typography variant="caption" color="inherit">
            Loading user...
          </Typography>
        </FullScreen>
      ) : (
        children
      )}
    </AuthContext>
  );
};

export default AuthProvider;
