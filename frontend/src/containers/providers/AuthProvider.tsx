import {
  type ContextType,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { flushSync } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import AuthContext from "@/store/context/AuthContext";
import FullScreen from "@/components/layout/FullScreen";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { setAccessToken } from "@/store/utils/auth";
import { accountEndpoints } from "@/store/endpoints/account";
import { markdownUtils } from "@/store/utils/markdown";
import { router } from "@/store/config/router";

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [me, setMe] = useState<ContextType<typeof AuthContext>["me"]>(null);

  /** Values */

  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  /** Callbacks */

  const signIn: ContextType<typeof AuthContext>["signIn"] = async (body) => {
    const res = await accountEndpoints.auth.token.post(body);
    flushSync(() => {
      setAccessToken(res.access);
      setMe(res.me);
    });
    snackbar.enqueueSnackbar(
      `Signed in as ${markdownUtils.bold(res.me.username)}`,
      { variant: "success" },
    );
  };

  const signOut: ContextType<typeof AuthContext>["signOut"] = async () => {
    try {
      await accountEndpoints.auth.token.revoke.post();
    } catch {
      // Revoke is best-effort; local state is always cleared below.
    } finally {
      flushSync(() => {
        setAccessToken(null);
        setMe(null);
        queryClient.clear();
        router.clearCache();
      });

      snackbar.enqueueSnackbar("Signed out", { variant: "success" });
    }
  };

  /** Effects */

  useEffect(() => {
    accountEndpoints.auth.token.refresh
      .post()
      .then((res) => {
        setAccessToken(res.access);
        setMe(res.me);
      })
      .catch(() => {
        setAccessToken(null);
        setMe(null);
      })
      .finally(() => setIsInitialized(true));
  }, []);

  return (
    <AuthContext value={{ me, signIn, signOut }}>
      {isInitialized ? (
        children
      ) : (
        <FullScreen>
          <StatusWrapper loading="Loading authentication..." />
        </FullScreen>
      )}
    </AuthContext>
  );
};

export default AuthProvider;
