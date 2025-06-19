import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showErrorToast = (message: string) => {
    toast.error(message, {
        className: "toast-error text-white ",
        position: "top-center",
        autoClose: 3000,
        closeButton: true,
        icon: false,
        draggable: true,
    });
};

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        className: "toast-success text-white ",
        autoClose: 3000,
        closeButton: true,
        icon: false,
        draggable: true,
    });
};
