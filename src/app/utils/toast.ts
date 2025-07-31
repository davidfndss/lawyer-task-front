import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const commonOptions = {
  position: "bottom-right" as const,
  autoClose: 7000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "dark" as const,
  transition: Bounce,
};

export const showError = (message: string) =>
  toast.error(message, commonOptions);

export const showSuccess = (message: string) =>
  toast.success(message, commonOptions);

export const showInfo = (message: string) =>
  toast.info(message, commonOptions);

export const showWarning = (message: string) =>
  toast.warn(message, commonOptions);
