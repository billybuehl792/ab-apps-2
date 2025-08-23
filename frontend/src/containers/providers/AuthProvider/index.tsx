import {
  type ContextType,
  useEffect,
  useState,
  type PropsWithChildren,
  useCallback,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthContext from "../../../store/context/AuthContext";
import { authUtils } from "@/store/utils/auth";
import { authQueries } from "@/store/queries/auth";
import { authMutations } from "@/store/mutations/auth";
import FullScreen from "@/components/layout/FullScreen";
import { CircularProgress, Typography } from "@mui/material";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] =
    useState<ContextType<typeof AuthContext>["user"]>(null);
  const [loading, setLoading] = useState(false);

  /** Values */

  const queryClient = useQueryClient();

  /** Mutations */

  const signIn: ContextType<typeof AuthContext>["signIn"] = useMutation(
    authMutations.authenticateUser()
  );

  /** Callbacks */

  const signOut: ContextType<typeof AuthContext>["signOut"] =
    useCallback(() => {
      authUtils.revokeTokens();
      setUser(null);
      queryClient.clear();
    }, [queryClient]);

  const handleFetchMe = useCallback(() => {
    setLoading(true);
    queryClient
      .fetchQuery(authQueries.me())
      .then((res) => setUser(res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [queryClient]);

  /** Effects */

  useEffect(() => {
    if (authUtils.getAccessToken()) handleFetchMe();
    else signOut();
  }, [handleFetchMe, signOut]);

  useEffect(() => {
    if (signIn.isSuccess) handleFetchMe();
  }, [signIn.isSuccess, handleFetchMe]);

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
