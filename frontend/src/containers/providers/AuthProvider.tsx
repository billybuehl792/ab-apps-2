import {
  type ContextType,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircularProgress, Typography } from "@mui/material";
import { authMutations } from "@/store/mutations/auth";
import AuthContext from "@/store/context/AuthContext";
import FullScreen from "@/components/layout/FullScreen";
import { queryUtils } from "@/store/utils/queries";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /** Values */

  const queryClient = useQueryClient();

  /** Mutations */

  const signInMutation = useMutation(authMutations.signIn());
  const signOutMutation = useMutation(authMutations.signOut());
  const refreshTokenMutation = useMutation(authMutations.refreshAccessToken());

  /** Callbacks */

  const signIn: ContextType<typeof AuthContext>["signIn"] = async (
    credentials
  ) => {
    await signInMutation.mutateAsync(credentials, {
      onSuccess: () => setIsAuthenticated(true),
    });
    await queryUtils.delay(500); // Allow auth state to propagate to router
  };

  const signOut: ContextType<typeof AuthContext>["signOut"] = async () => {
    await signOutMutation.mutateAsync(undefined, {
      onSuccess: () => {
        setIsAuthenticated(false);
        queryClient.clear();
      },
    });
    await queryUtils.delay(500); // Allow auth state to propagate to router
  };

  /** Effects */

  useEffect(() => {
    refreshTokenMutation.mutate(undefined, {
      onSuccess: () => setIsAuthenticated(true),
      onError: () => setIsAuthenticated(false),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext
      value={{
        isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {refreshTokenMutation.isPending ? (
        <FullScreen>
          <CircularProgress color="inherit" />
          <Typography variant="caption" color="inherit">
            Loading auth state...
          </Typography>
        </FullScreen>
      ) : (
        children
      )}
    </AuthContext>
  );
};

export default AuthProvider;
