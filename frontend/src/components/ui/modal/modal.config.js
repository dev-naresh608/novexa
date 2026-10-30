import { MODAL_TYPES } from "./modal.types";
import Login from "../../../modules/auth/pages/Login";
import Signup from "../../../modules/auth/pages/Signup";
import AddressForm from "../../../modules/address/components/AddressForm";
import ConfirmModal from "./ConfirmModal";

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.LOGIN]: Login,
  [MODAL_TYPES.SIGNUP]: Signup,
  [MODAL_TYPES.ADDRESS]: AddressForm,
  [MODAL_TYPES.CONFIRM]: ConfirmModal,
};
