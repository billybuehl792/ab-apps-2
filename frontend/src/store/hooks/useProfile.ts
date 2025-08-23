import { use } from "react";
import ProfileContext from "../context/ProfileContext";

const useProfile = () => use(ProfileContext);

export default useProfile;
