const getVariantClasses = (variant) => {
  switch (variant) {
    case "error":
      return "bg-red-600";
    case "success":
      return "bg-green-600";
    case "warning":
      return "bg-yellow-600";
    default:
      return "bg-black";
  }
};

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const { message, variant } = toast;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-white ${getVariantClasses(
          variant
        )}`}
      >
        <span>{message}</span>
        <button
          type="button"
          className="text-white/80 hover:text-white"
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
