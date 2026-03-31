import { createContext, useContext, useState, type ReactNode } from "react";
import {
  MdCheckCircle,
  MdClose,
  MdError,
  MdInfo,
  MdWarning,
} from "react-icons/md";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

const toastStyle = {
  success: {
    container: "bg-[#0f0f0d] border border-teal-900",
    icon: "text-teal-400",
    text: "text-teal-300",
    bar: "bg-teal-500",
    Icon: MdCheckCircle,
  },
  error: {
    container: "bg-[#0f0f0d] border border-red-900",
    icon: "text-red-400",
    text: "text-red-300",
    bar: "bg-red-500",
    Icon: MdError,
  },
  warning: {
    container: "bg-[0f0f0d] border border-amber-900",
    icon: "text-amber-400",
    bar: "text-amber-300",
    text: "text-amber-500",
    Icon: MdWarning,
  },
  info: {
    container: "bg-[0f0f0d] border border-blue-900",
    icon: "text-blue-400",
    bar: "text-blue-300",
    text: "text-blue-500",
    Icon: MdInfo,
  },
};

const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  const style = toastStyle[toast.type];
  const { Icon } = style;

  return (
    <div
      className={`relative flex items-start gap-3 px-4 py-3 rounded-xl w-72 overflow-hidden shadow-lg animate-in ${style.container}`}
    >
      <div className={`absolute bottom-0 left-0 h-0.5 ${style.bar}`} />

      <Icon size={16} className={`${style.icon} shrink-0 mt-0.5`} />

      <p className={`flex-1 text-[12px] ${style.text}`}>{toast.message}</p>

      <button
        onClick={() => onRemove(toast.id)}
        className="text-neutral-700 hover:text-neutral-400 transition-colors shrink-0"
      >
        <MdClose size={14} />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToast((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToast((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToast((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toast.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be within ToastProvider");
  return context;
};
