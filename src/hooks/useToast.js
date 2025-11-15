import { useCallback, useEffect, useState } from "react";

const DEFAULT_DURATION = 3000;

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success", duration) => {
    setToast({
      id: Date.now(),
      message,
      variant,
      duration: typeof duration === "number" ? duration : DEFAULT_DURATION,
    });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = window.setTimeout(
      () => setToast(null),
      toast.duration ?? DEFAULT_DURATION
    );
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return { toast, showToast, dismissToast };
};

export default useToast;
