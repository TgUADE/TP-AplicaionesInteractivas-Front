import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hook/useAuth";

import ProductsTab from "../../components/Admin/tabs/ProductsTab";
import ProductCreateModal from "../../components/Admin/modals/Products/ProductCreateModal";
import ProductEditModal from "../../components/Admin/modals/Products/ProductEditModal";
import ProductImagesModal from "../../components/Admin/modals/Products/ProductImagesModal";

import {
  getProducts,
  createProduct,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  uploadProductImage,
  updateProductImage,
  deleteProductImage,
} from "../../services/products";

const API_BASE = "/api";

const emptyProduct = {
  id: null,
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
};

const ProductsAdmin = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyProduct);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage, pageSize]);

  const [pendingProductDeleteId, setPendingProductDeleteId] = useState(null);

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageProduct, setImageProduct] = useState(null);
  const [imageForm, setImageForm] = useState({
    imageUrl: "",
    altText: "",
    isPrimary: true,
    displayOrder: 1,
  });
  const [editingImage, setEditingImage] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const updateProductForm = (patch) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const updateImageForm = (patch) =>
    setImageForm((prev) => ({ ...prev, ...patch }));

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(token);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Error cargando productos");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(products.length / pageSize));
    if (currentPage > tp) setCurrentPage(tp);
  }, [products, currentPage, pageSize]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Error cargando categorías");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyProduct);
    setIsCreateOpen(true);
    if (categories.length === 0) {
      fetchCategories();
    }
  };

  const openEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? product.original_price ?? "",
      stock: product.stock ?? "",
      category_id: product.category?.id ?? product.category_id ?? "",
    });
    setIsEditOpen(true);
    if (categories.length === 0) {
      fetchCategories();
    }
  };

  const openImageModal = (product) => {
    setImageProduct(product);
    setImageForm({
      imageUrl: "",
      altText: "",
      isPrimary: true,
      displayOrder: 1,
    });
    setIsImageOpen(true);
    setEditingImage(false);
  };

  const openEditImage = (image) => {
    setEditingImage(true);
    setImageForm({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      isPrimary: image.isPrimary,
      displayOrder: image.displayOrder,
    });
    setIsImageOpen(true);
  };

  const saveProduct = async () => {
    try {
      if (!form.name || !form.price || !form.stock || !form.category_id) {
        alert("Completa nombre, precio, stock y categoría.");
        return;
      }
      setSaving(true);
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: form.category_id,
      };
      await createProduct(token, body);
      setIsCreateOpen(false);
      setForm(emptyProduct);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async () => {
    try {
      if (!form.id) {
        alert("Producto inválido");
        return;
      }
      if (!form.name || !form.price || !form.stock || !form.category_id) {
        alert("Completa nombre, precio, stock y categoría.");
        return;
      }
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: form.category_id,
      };
      await updateProductService(token, form.id, body);
      setIsEditOpen(false);
      setForm(emptyProduct);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      setPendingProductDeleteId(id);
      await deleteProductService(token, id);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setPendingProductDeleteId(null);
    }
  };

  const uploadImage = async () => {
    try {
      if (!imageProduct?.id) {
        alert("Producto inválido");
        return;
      }
      if (!imageForm.imageUrl) {
        alert("Ingresa la URL de la imagen");
        return;
      }
      setSavingImage(true);
      const body = {
        imageUrl: imageForm.imageUrl,
        altText: imageForm.altText,
        isPrimary: Boolean(imageForm.isPrimary),
        displayOrder: Number(imageForm.displayOrder),
      };
      await uploadProductImage(token, imageProduct.id, body);
      alert("Imagen subida");
      setIsImageOpen(false);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSavingImage(false);
    }
  };

  const editImage = async () => {
    try {
      if (!imageProduct?.id) {
        alert("Producto inválido");
        return;
      }
      if (!imageForm.imageUrl) {
        alert("Ingresa la URL de la imagen");
        return;
      }
      setSavingImage(true);
      const body = {
        imageUrl: imageForm.imageUrl,
        altText: imageForm.altText,
        isPrimary: Boolean(imageForm.isPrimary),
        displayOrder: Number(imageForm.displayOrder),
      };
      await updateProductImage(token, imageProduct.id, imageForm.id, body);
      alert("Imagen editada");
      setIsImageOpen(false);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSavingImage(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (!imageProduct?.id) {
      alert("Producto inválido");
      return;
    }
    if (!confirm("¿Eliminar imagen?")) return;
    try {
      setDeletingImageId(imageId);
      await deleteProductImage(token, imageProduct.id, imageId);
      alert("Imagen eliminada");
      setIsImageOpen(false);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setDeletingImageId(null);
    }
  };

  return (
    <>
      <ProductCreateModal
        isOpen={isCreateOpen}
        form={form}
        categories={categories}
        categoriesLoading={categoriesLoading}
        saving={saving}
        onClose={() => setIsCreateOpen(false)}
        onChange={updateProductForm}
        onSubmit={saveProduct}
      />

      <ProductEditModal
        isOpen={isEditOpen}
        form={form}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onClose={() => setIsEditOpen(false)}
        onChange={updateProductForm}
        onSubmit={updateProduct}
      />

      <ProductImagesModal
        isOpen={isImageOpen}
        product={imageProduct}
        form={imageForm}
        editing={editingImage}
        saving={savingImage}
        deletingImageId={deletingImageId}
        onClose={() => setIsImageOpen(false)}
        onChangeForm={updateImageForm}
        onUpload={uploadImage}
        onEdit={editImage}
        onOpenEditImage={openEditImage}
        onDeleteImage={deleteImage}
      />

      <ProductsTab
        products={products}
        pagedProducts={pagedProducts}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pendingDeleteId={pendingProductDeleteId}
        onPageChange={setCurrentPage}
        onOpenCreate={openCreate}
        onOpenImageModal={openImageModal}
        onOpenEdit={openEdit}
        onDeleteProduct={deleteProduct}
      />
    </>
  );
};

export default ProductsAdmin;
