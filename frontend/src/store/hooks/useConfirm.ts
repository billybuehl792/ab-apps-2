import { use } from "react";
import ConfirmContext from "../context/ConfirmContext";

const useConfirm = () => use(ConfirmContext);

export default useConfirm;
