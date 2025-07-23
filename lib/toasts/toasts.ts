import { toast, ToastOptions, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseOptions: ToastOptions = {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Zoom,
};

export const showSuccessToast = (message: string) => {
    toast(message, {
        ...baseOptions,
        type: "success",
        className:
            "bg-green-600 text-white rounded-xl shadow-lg px-5 py-4 text-sm font-medium backdrop-blur-sm",
        progressClassName: "bg-white/30",
    });
};

export const showErrorToast = (message: string) => {
    toast(message, {
        ...baseOptions,
        type: "error",
        className:
            "bg-red-600 text-white rounded-xl shadow-lg px-5 py-4 text-sm font-medium backdrop-blur-sm",
        progressClassName: "bg-white/30",
    });
};

export const showWarningToast = (message: string) => {
    toast(message, {
        ...baseOptions,
        type: "warning",
        className:
            "bg-yellow-600 text-white rounded-xl shadow-lg px-5 py-4 text-sm font-medium backdrop-blur-sm",
        progressClassName: "bg-white/30",
    });
};

export const showInfoToast = (message: string) => {
    toast(message, {
        ...baseOptions,
        type: "info",
        className:
            "bg-blue-600 text-white rounded-xl shadow-lg px-5 py-4 text-sm font-medium backdrop-blur-sm",
        progressClassName: "bg-white/30",
    });
};
