import {
  type ContextType,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountMutations } from "@/store/mutations/account";
import AuthContext from "@/store/context/AuthContext";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import { queryUtils } from "@/store/utils/queries";
import { authUtils } from "@/store/utils/auth";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [me, setMe] = useState<ContextType<typeof AuthContext>["me"]>(null);

  /** Values */

  const queryClient = useQueryClient();

  /** Mutations */

  const tokenMutation = useMutation(accountMutations.token());
  const tokenRefreshMutation = useMutation(accountMutations.tokenRefresh());
  const tokenRevokeMutation = useMutation(accountMutations.tokenRevoke());

  /** Callbacks */

  const signIn: ContextType<typeof AuthContext>["signIn"] = async (
    credentials
  ) => {
    await tokenMutation.mutateAsync(credentials, {
      onSuccess: (res) => {
        authUtils.setAccessToken(res.data.access);
        setMe(res.data.me);
      },
    });
    await queryUtils.delay(500); // Allow auth state to propagate to router
  };

  const signOut: ContextType<typeof AuthContext>["signOut"] = async () => {
    await tokenRevokeMutation.mutateAsync(undefined, {
      onSuccess: () => {
        authUtils.setAccessToken(null);
        setMe(null);
        queryClient.clear();
      },
    });
    await queryUtils.delay(500); // Allow auth state to propagate to router
  };

  /** Effects */

  useEffect(() => {
    tokenRefreshMutation.mutate(undefined, {
      onSuccess: (res) => {
        authUtils.setAccessToken(res.data.access);
        setMe(res.data.me);
      },
      onError: () => {
        authUtils.setAccessToken(null);
        setMe(null);
      },
      onSettled: () => setIsInitialized(true),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext value={{ me, signIn, signOut }}>
      {isInitialized ? (
        children
      ) : (
        <FullScreen>
          <StatusCard loading="Loading authentication..." />
        </FullScreen>
      )}
    </AuthContext>
  );
};

export default AuthProvider;
