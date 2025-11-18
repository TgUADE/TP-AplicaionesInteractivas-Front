import SuccessIcon from "../../icons/SuccesIcon";
import ErrorIcon from "../../icons/ErrorIcon";
import WarningIcon from "../../icons/WarningIcon";

const getVariantClasses = (variant) => {
  switch (variant) {
    case "error":
      return "bg-red-50 border-red-500 text-red-900";
    case "success":
      return "bg-green-50 border-green-500 text-green-900";
    case "warning":
      return "bg-yellow-50 border-yellow-500 text-yellow-900";
    case "info":
      return "bg-blue-50 border-blue-500 text-blue-900";
    default:
      return "bg-gray-50 border-gray-500 text-gray-900";
  }
};

const getIconClasses = (variant) => {
  switch (variant) {
    case "error":
      return "text-red-500";
    case "success":
      return "text-green-500";
    case "warning":
      return "text-yellow-500";
    case "info":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

const getIcon = (variant) => {
  switch (variant) {
    case "error":
      return <ErrorIcon />;
    case "success":
      return <SuccessIcon />;
    case "warning":
      return <WarningIcon />;
    case "info":
      return "ℹ";
    default:
      return "•";
  }
};

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const { message, variant } = toast;

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-in">
      <div
        className={`min-w-[320px] px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-start gap-3 ${getVariantClasses(
          variant
        )}`}
      >
        <span className={`text-xl font-bold ${getIconClasses(variant)}`}>
          {getIcon(variant)}
        </span>
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors ml-2 text-xl leading-none"
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;