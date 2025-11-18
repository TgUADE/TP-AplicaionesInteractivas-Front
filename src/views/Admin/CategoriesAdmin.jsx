import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoriesTab from "../../components/Admin/tabs/CategoriesTab";
import CategoryCreateModal from "../../components/Admin/modals/Categories/CategoryCreateModal";
import CategoryEditModal from "../../components/Admin/modals/Categories/CategoryEditModal";
import Toast from "../../components/UI/Toast";
import useToast from "../../hook/useToast";
import { fetchCategories } from "../../redux/slices/categorySlice";
import {
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../../redux/slices/Admin/adminCategoriesSlice";

const emptyCategory = {
  id: null,
  description: "",
};

const CategoriesAdmin = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { toast, showToast, dismissToast } = useToast();

  const { items: categories = [], loading: categoriesLoading = false } =
    useSelector((state) => state.categories) ?? {};
  const { mutationStatus = "idle" } =
    useSelector((state) => state.adminCategories) ?? {};

  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const isMutating = mutationStatus === "loading";

  const updateCategoryForm = (patch) =>
    setCategoryForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!token) return;
    dispatch(fetchCategories())
      .unwrap()
      .catch((error) => {
        console.error("Error loading categories", error);
        showToast(error?.message || "Could not load categories.", "error");
      });
  }, [dispatch, showToast, token]);

  const openCreateCategory = () => {
    setCategoryForm(emptyCategory);
    setIsCategoryCreateOpen(true);
  };

  const openEditCategory = (category) => {
    setCategoryForm({
      id: category.id,
      description: category.description ?? "",
    });
    setIsCategoryEditOpen(true);
  };

  const saveCategory = async () => {
    try {
      if (!categoryForm.description?.trim()) {
        showToast("Enter a description.", "error");
        return;
      }
      await dispatch(
        createAdminCategory({
          description: categoryForm.description.trim(),
        })
      ).unwrap();
      await dispatch(fetchCategories()).unwrap();
      setIsCategoryCreateOpen(false);
      setCategoryForm(emptyCategory);
      showToast("Category created successfully.", "success");
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not create the category.", "error");
    }
  };

  const updateCategory = async () => {
    try {
      if (!categoryForm.id) {
        showToast("Invalid category.", "error");
        return;
      }
      if (!categoryForm.description?.trim()) {
        showToast("Enter a description.", "error");
        return;
      }
      await dispatch(
        updateAdminCategory({
          categoryId: categoryForm.id,
          payload: {
            description: categoryForm.description.trim(),
          },
        })
      ).unwrap();
      await dispatch(fetchCategories()).unwrap();
      setIsCategoryEditOpen(false);
      setCategoryForm(emptyCategory);
      showToast("Category updated successfully.", "success");
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not update the category.", "error");
    }
  };

  const deleteCategoryById = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      await dispatch(deleteAdminCategory(id)).unwrap();
      await dispatch(fetchCategories()).unwrap();
      showToast("Category deleted.", "success");
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not delete the category.", "error");
    }
  };

  return (
    <>
      <CategoryCreateModal
        isOpen={isCategoryCreateOpen}
        form={categoryForm}
        saving={isMutating}
        onClose={() => setIsCategoryCreateOpen(false)}
        onChange={updateCategoryForm}
        onSubmit={saveCategory}
      />

      <CategoryEditModal
        isOpen={isCategoryEditOpen}
        form={categoryForm}
        saving={isMutating}
        onClose={() => setIsCategoryEditOpen(false)}
        onChange={updateCategoryForm}
        onSubmit={updateCategory}
      />

      <CategoriesTab
        categories={categories}
        loading={categoriesLoading}
        onOpenCreate={openCreateCategory}
        onOpenEdit={openEditCategory}
        onDelete={deleteCategoryById}
      />
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
};

export default CategoriesAdmin;
