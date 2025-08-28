import { use } from "react";
import MenuContext from "../context/MenuContext";

const useMenu = () => use(MenuContext);

export default useMenu;
