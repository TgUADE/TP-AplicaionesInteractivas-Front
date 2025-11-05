import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hook/useAuth";

import CategoriesTab from "../../components/Admin/tabs/CategoriesTab";
import CategoryCreateModal from "../../components/Admin/modals/Categories/CategoryCreateModal";
import CategoryEditModal from "../../components/Admin/modals/Categories/CategoryEditModal";

import {
  getCategories as getCategoriesService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "../../services/categories";

const emptyCategory = {
  id: null,
  description: "",
};

const CategoriesAdmin = () => {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  const updateCategoryForm = (patch) =>
    setCategoryForm((prev) => ({ ...prev, ...patch }));

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await getCategoriesService(token);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Error cargando categorías");
    } finally {
      setCategoriesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        alert("Ingresa una descripción");
        return;
      }
      setSavingCategory(true);
      await createCategoryService(token, {
        description: categoryForm.description.trim(),
      });
      setIsCategoryCreateOpen(false);
      setCategoryForm(emptyCategory);
      await fetchCategories();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const updateCategory = async () => {
    try {
      if (!categoryForm.id) {
        alert("Categoría inválida");
        return;
      }
      if (!categoryForm.description?.trim()) {
        alert("Ingresa una descripción");
        return;
      }
      setSavingCategory(true);
      await updateCategoryService(token, categoryForm.id, {
        description: categoryForm.description.trim(),
      });
      setIsCategoryEditOpen(false);
      setCategoryForm(emptyCategory);
      await fetchCategories();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const deleteCategoryById = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      await deleteCategoryService(token, id);
      await fetchCategories();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <CategoryCreateModal
        isOpen={isCategoryCreateOpen}
        form={categoryForm}
        saving={savingCategory}
        onClose={() => setIsCategoryCreateOpen(false)}
        onChange={updateCategoryForm}
        onSubmit={saveCategory}
      />

      <CategoryEditModal
        isOpen={isCategoryEditOpen}
        form={categoryForm}
        saving={savingCategory}
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
    </>
  );
};

export default CategoriesAdmin;
