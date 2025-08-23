import { type ContextType, type PropsWithChildren } from "react";
import ProfileContext from "@/store/context/ProfileContext";

const ProfileProvider = ({
  children,
  ...value
}: PropsWithChildren & ContextType<typeof ProfileContext>) => {
  return <ProfileContext value={value}>{children}</ProfileContext>;
};

export default ProfileProvider;
