import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hook/useAuth";

import PromotionsTab from "../../components/Admin/tabs/PromotionsTab";
import PromotionCreateModal from "../../components/Admin/modals/Promotions/PromotionCreateModal";
import PromotionEditModal from "../../components/Admin/modals/Promotions/PromotionEditModal";
import ErrorModal from "../../components/Admin/modals/ErrorModal";

import { getProducts } from "../../services/products";

import {
  getPromotions as getPromotionsService,
  createPromotion as createPromotionService,
  updatePromotion as updatePromotionService,
  deletePromotion as deletePromotionService,
  activatePromotion as activatePromotionService,
  deactivatePromotion as deactivatePromotionService,
} from "../../services/promotions";

const emptyPromotion = {
  id: null,
  name: "",
  description: "",
  type: "PERCENTAGE",
  value: "",
  start_date: "",
  end_date: "",
  product_id: "",
  active: true,
};

const PromotionsAdmin = () => {
  const { token } = useAuth();

  const [promotions, setPromotions] = useState([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [promotionForm, setPromotionForm] = useState(emptyPromotion);
  const [isPromotionCreateOpen, setIsPromotionCreateOpen] = useState(false);
  const [isPromotionEditOpen, setIsPromotionEditOpen] = useState(false);
  const [savingPromotion, setSavingPromotion] = useState(false);
  const [pendingPromotionId, setPendingPromotionId] = useState(null);

  const [products, setProducts] = useState([]);

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const updatePromotionForm = (patch) =>
    setPromotionForm((prev) => ({ ...prev, ...patch }));

  const openError = (title, message) => {
    setErrorModal({ open: true, title, message });
  };

  const closeError = () => {
    setErrorModal({ open: false, title: "", message: "" });
  };

  const toBackendDate = (value) =>
    value ? (value.length === 16 ? `${value}:00` : value) : "";

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts(token);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Error cargando productos");
    }
  }, [token]);

  const fetchPromotions = useCallback(async () => {
    setPromotionsLoading(true);
    try {
      const data = await getPromotionsService(token);
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at);
            const dateB = new Date(b.createdAt || b.created_at);
            return dateB - dateA;
          })
        : [];
      setPromotions(sortedData);
    } catch (error) {
      console.error(error);
      alert("Error cargando promociones");
    } finally {
      setPromotionsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    const handler = () => {
      fetchPromotions();
    };
    window.addEventListener("promotions_updated", handler);
    return () => window.removeEventListener("promotions_updated", handler);
  }, [fetchPromotions]);

  const openCreatePromotion = () => {
    setPromotionForm(emptyPromotion);
    setIsPromotionCreateOpen(true);
    if (products.length === 0) {
      loadProducts();
    }
  };

  const openEditPromotion = (promotion) => {
    setPromotionForm({
      id: promotion.id,
      name: promotion.name ?? "",
      description: promotion.description ?? "",
      type: promotion.type ?? "PERCENTAGE",
      value: promotion.value ?? "",
      start_date: (promotion.start_date || "").slice(0, 19),
      end_date: (promotion.end_date || "").slice(0, 19),
      product_id: promotion.product_id ?? promotion.product?.id ?? "",
      active: !!promotion.active,
    });
    setIsPromotionEditOpen(true);
    if (products.length === 0) {
      loadProducts();
    }
  };

  const savePromotion = async () => {
    try {
      const valueNum = Number(promotionForm.value);

      if (promotionForm.type === "PERCENTAGE") {
        if (isNaN(valueNum) || valueNum <= 0 || valueNum > 70) {
          openError(
            "Error creando promoción",
            "Para tipo PERCENTAGE, el valor debe ser entre 1 y 70."
          );
          return;
        }
      } else if (promotionForm.type === "FIXED_AMOUNT") {
        if (isNaN(valueNum) || valueNum <= 0) {
          openError(
            "Error creando promoción",
            "Para tipo FIXED_AMOUNT, el valor debe ser mayor a 0."
          );
          return;
        }
      }

      const body = {
        name: promotionForm.name,
        description: promotionForm.description,
        type: promotionForm.type,
        value: valueNum,
        start_date: toBackendDate(promotionForm.start_date),
        end_date: toBackendDate(promotionForm.end_date),
        product_id: promotionForm.product_id,
        active: promotionForm.active ?? true,
      };

      setSavingPromotion(true);

      await createPromotionService(token, body);

      setIsPromotionCreateOpen(false);
      setPromotionForm(emptyPromotion);
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (error) {
      openError(
        "Error creando promoción",
        error?.message || "Error desconocido"
      );
    } finally {
      setSavingPromotion(false);
    }
  };

  const updatePromotion = async () => {
    try {
      if (!promotionForm.id) {
        openError("Error actualizando promoción", "Promoción inválida");
        return;
      }

      const valueNum = Number(promotionForm.value);

      if (promotionForm.type === "PERCENTAGE") {
        if (isNaN(valueNum) || valueNum <= 0 || valueNum > 70) {
          openError(
            "Error actualizando promoción",
            "Para tipo PERCENTAGE, el valor debe ser entre 1 y 70."
          );
          return;
        }
      } else if (promotionForm.type === "FIXED_AMOUNT") {
        if (isNaN(valueNum) || valueNum <= 0) {
          openError(
            "Error actualizando promoción",
            "Para tipo FIXED_AMOUNT, el valor debe ser mayor a 0."
          );
          return;
        }
      }

      const body = {
        name: promotionForm.name,
        description: promotionForm.description,
        type: promotionForm.type,
        value: valueNum,
        start_date: toBackendDate(promotionForm.start_date),
        end_date: toBackendDate(promotionForm.end_date),
        product_id: promotionForm.product_id,
        active: promotionForm.active ?? true,
      };

      setSavingPromotion(true);

      await updatePromotionService(token, promotionForm.id, body);

      setIsPromotionEditOpen(false);
      setPromotionForm(emptyPromotion);
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (error) {
      openError(
        "Error actualizando promoción",
        error?.message || "Error desconocido"
      );
    } finally {
      setSavingPromotion(false);
    }
  };

  const deletePromotion = async (id) => {
    if (!confirm("¿Eliminar promoción?")) return;
    try {
      await deletePromotionService(token, id);
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const activatePromotion = async (id) => {
    try {
      setPendingPromotionId(id);
      await activatePromotionService(token, id);
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setPendingPromotionId(null);
    }
  };

  const deactivatePromotion = async (id) => {
    try {
      setPendingPromotionId(id);
      await deactivatePromotionService(token, id);
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setPendingPromotionId(null);
    }
  };

  return (
    <>
      <PromotionCreateModal
        isOpen={isPromotionCreateOpen}
        form={promotionForm}
        saving={savingPromotion}
        products={products}
        onClose={() => setIsPromotionCreateOpen(false)}
        onChange={updatePromotionForm}
        onSubmit={savePromotion}
      />

      <PromotionEditModal
        isOpen={isPromotionEditOpen}
        form={promotionForm}
        saving={savingPromotion}
        products={products}
        onClose={() => setIsPromotionEditOpen(false)}
        onChange={updatePromotionForm}
        onSubmit={updatePromotion}
      />

      <ErrorModal
        isOpen={errorModal.open}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeError}
      />

      <PromotionsTab
        promotions={promotions}
        loading={promotionsLoading}
        pendingId={pendingPromotionId}
        onOpenCreate={openCreatePromotion}
        onOpenEdit={openEditPromotion}
        onActivate={activatePromotion}
        onDeactivate={deactivatePromotion}
        onDelete={deletePromotion}
      />
    </>
  );
};

export default PromotionsAdmin;
