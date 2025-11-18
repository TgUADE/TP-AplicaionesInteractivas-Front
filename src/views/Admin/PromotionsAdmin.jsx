import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PromotionsTab from "../../components/Admin/tabs/PromotionsTab";
import PromotionCreateModal from "../../components/Admin/modals/Promotions/PromotionCreateModal";
import PromotionEditModal from "../../components/Admin/modals/Promotions/PromotionEditModal";
import ErrorModal from "../../components/Admin/modals/ErrorModal";

import {
  fetchAdminPromotions,
  createAdminPromotion,
  updateAdminPromotion,
  deleteAdminPromotion,
  activateAdminPromotion,
  deactivateAdminPromotion,
} from "../../redux/slices/Admin/adminPromotionsSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import {
  fetchPromotions as fetchPublicPromotions,
  productsOnSale as fetchProductsOnSale,
} from "../../redux/slices/promotionSlice";
import useToast from "../../hook/useToast";
import Toast from "../../components/UI/Toast";

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
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const {
    items: adminPromotions = [],
    loading: promotionsLoading = false,
    mutationStatus,
    mutationError,
    error: listError,
  } = useSelector((state) => state.adminPromotions) ?? {};
  const { items: products = [] } = useSelector((state) => state.products) ?? {};

  const { toast, showToast, dismissToast } = useToast();

  const [promotionForm, setPromotionForm] = useState(emptyPromotion);
  const [isPromotionCreateOpen, setIsPromotionCreateOpen] = useState(false);
  const [isPromotionEditOpen, setIsPromotionEditOpen] = useState(false);
  const [pendingPromotionId, setPendingPromotionId] = useState(null);

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const promotions = useMemo(() => adminPromotions, [adminPromotions]);
  const isMutating = mutationStatus === "loading";

  const updatePromotionForm = (patch) =>
    setPromotionForm((prev) => ({ ...prev, ...patch }));

  const refreshPublicPromotionData = async () => {
    try {
      await dispatch(fetchPublicPromotions()).unwrap();
    } catch (error) {
      console.error("Error updating public promotions", error);
    }
    try {
      await dispatch(fetchProductsOnSale()).unwrap();
    } catch (error) {
      console.error("Error updating products on sale", error);
    }
  };

  const openError = (title, message) => {
    setErrorModal({ open: true, title, message });
  };

  const closeError = () => {
    setErrorModal({ open: false, title: "", message: "" });
  };

  const toBackendDate = (value) =>
    value ? (value.length === 16 ? `${value}:00` : value) : "";

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAdminPromotions())
      .unwrap()
      .catch((error) => {
        console.error("Error loading promotions", error);
        showToast(error?.message || "Could not load promotions.", "error");
      });
  }, [dispatch, showToast, token]);

  useEffect(() => {
    if (!token) return;
    if (products.length === 0) {
      dispatch(fetchProducts())
        .unwrap()
        .catch((error) => {
          console.error("Error loading products", error);
          showToast(error?.message || "Could not load products.", "error");
        });
    }
  }, [dispatch, showToast, token, products.length]);

  useEffect(() => {
    if (mutationStatus === "failed" && mutationError) {
      showToast(mutationError, "error");
    }
  }, [mutationStatus, mutationError, showToast]);

  useEffect(() => {
    if (listError) {
      showToast(listError, "error");
    }
  }, [listError, showToast]);

  const openCreatePromotion = () => {
    setPromotionForm(emptyPromotion);
    setIsPromotionCreateOpen(true);
    if (products.length === 0) {
      dispatch(fetchProducts())
        .unwrap()
        .catch(() => {});
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
      dispatch(fetchProducts())
        .unwrap()
        .catch(() => {});
    }
  };

  const savePromotion = async () => {
    try {
      const valueNum = Number(promotionForm.value);

      if (promotionForm.type === "PERCENTAGE") {
        if (isNaN(valueNum) || valueNum <= 0 || valueNum > 70) {
          openError(
            "Error creating promotion",
            "For type PERCENTAGE, the value must be between 1 and 70."
          );
          return;
        }
      } else if (promotionForm.type === "FIXED_AMOUNT") {
        if (isNaN(valueNum) || valueNum <= 0) {
          openError(
            "Error creating promotion",
            "For type FIXED_AMOUNT, the value must be greater than 0."
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

      await dispatch(createAdminPromotion(body)).unwrap();
      await refreshPublicPromotionData();
      setIsPromotionCreateOpen(false);
      setPromotionForm(emptyPromotion);
      showToast("Promotion created successfully.", "success");
    } catch (error) {
      openError("Error creating promotion", error?.message || "Unknown error");
    }
  };

  const updatePromotion = async () => {
    try {
      if (!promotionForm.id) {
        openError("Error updating promotion", "Invalid promotion");
        return;
      }

      const valueNum = Number(promotionForm.value);

      if (promotionForm.type === "PERCENTAGE") {
        if (isNaN(valueNum) || valueNum <= 0 || valueNum > 70) {
          openError(
            "Error updating promotion",
            "For type PERCENTAGE, the value must be between 1 and 70."
          );
          return;
        }
      } else if (promotionForm.type === "FIXED_AMOUNT") {
        if (isNaN(valueNum) || valueNum <= 0) {
          openError(
            "Error updating promotion",
            "For type FIXED_AMOUNT, the value must be greater than 0."
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

      await dispatch(
        updateAdminPromotion({
          promotionId: promotionForm.id,
          payload: body,
        })
      ).unwrap();
      await refreshPublicPromotionData();
      setIsPromotionEditOpen(false);
      setPromotionForm(emptyPromotion);
      showToast("Promotion updated successfully.", "success");
    } catch (error) {
      openError("Error updating promotion", error?.message || "Unknown error");
    }
  };

  const deletePromotion = async (id) => {
    if (!confirm("Delete promotion?")) return;
    try {
      await dispatch(deleteAdminPromotion(id)).unwrap();
      await refreshPublicPromotionData();
      showToast("Promotion deleted.", "success");
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not delete the promotion.", "error");
    }
  };

  const activatePromotion = async (id) => {
    try {
      setPendingPromotionId(id);
      await dispatch(activateAdminPromotion(id)).unwrap();
      await refreshPublicPromotionData();
      showToast("Promotion activated.", "success");
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not activate the promotion.", "error");
    } finally {
      setPendingPromotionId(null);
    }
  };

  const deactivatePromotion = async (id) => {
    try {
      setPendingPromotionId(id);
      await dispatch(deactivateAdminPromotion(id)).unwrap();
      await refreshPublicPromotionData();
      showToast("Promotion deactivated.", "success");
    } catch (error) {
      console.error(error);
      showToast(
        error?.message || "Could not deactivate the promotion.",
        "error"
      );
    } finally {
      setPendingPromotionId(null);
    }
  };

  return (
    <>
      <PromotionCreateModal
        isOpen={isPromotionCreateOpen}
        form={promotionForm}
        saving={isMutating}
        products={products}
        onClose={() => setIsPromotionCreateOpen(false)}
        onChange={updatePromotionForm}
        onSubmit={savePromotion}
      />

      <PromotionEditModal
        isOpen={isPromotionEditOpen}
        form={promotionForm}
        saving={isMutating}
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
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
};

export default PromotionsAdmin;
