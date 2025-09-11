import {
  type ContextType,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountQueries } from "@/store/queries/account";
import { accountMutations } from "@/store/mutations/account";
import AuthContext from "@/store/context/AuthContext";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import { queryUtils } from "@/store/utils/queries";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /** Values */

  const queryClient = useQueryClient();

  /** Queries */

  const meQuery = useQuery({
    ...accountQueries.me(),
    enabled: isAuthenticated,
  });

  /** Mutations */

  const signInMutation = useMutation(accountMutations.signIn());
  const signOutMutation = useMutation(accountMutations.signOut());
  const refreshTokenMutation = useMutation(
    accountMutations.refreshAccessToken()
  );

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
        me: meQuery.data ?? null,
        signIn,
        signOut,
      }}
    >
      {refreshTokenMutation.isPending ||
      meQuery.isLoading ||
      meQuery.isError ? (
        <FullScreen>
          <StatusCard
            loading="Loading authentication..."
            error={meQuery.error}
          />
        </FullScreen>
      ) : (
        children
      )}
    </AuthContext>
  );
};

export default AuthProvider;
