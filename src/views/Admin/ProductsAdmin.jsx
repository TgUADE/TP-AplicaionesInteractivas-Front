import { useEffect, useMemo, useState } from "react";

import ProductsTab from "../../components/Admin/tabs/ProductsTab";
import ProductCreateModal from "../../components/Admin/modals/Products/ProductCreateModal";
import ProductEditModal from "../../components/Admin/modals/Products/ProductEditModal";
import ProductImagesModal from "../../components/Admin/modals/Products/ProductImagesModal";

import { useDispatch, useSelector } from "react-redux";
import {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadAdminProductImage,
  updateAdminProductImage,
  deleteAdminProductImage,
} from "../../redux/slices/Admin/adminProductsSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import Toast from "../../components/UI/Toast";
import useToast from "../../hook/useToast";
const emptyProduct = {
  id: null,
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
};

const ProductsAdmin = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { items: products = [], loading: productsLoading = false } =
    useSelector((state) => state.products) ?? {};

  const { mutationStatus = "idle" } =
    useSelector((state) => state.adminProducts) ?? {};
  const { items: categories = [], loading: categoriesLoading = false } =
    useSelector((state) => state.categories) ?? {};

  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => {
    if (!token) return;
    dispatch(fetchProducts())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching products", error);
        showToast(
          error?.message || "No se pudieron cargar los productos.",
          "error"
        );
      });
  }, [dispatch, showToast, token]);

  const isMutating = mutationStatus === "loading";

  const [form, setForm] = useState(emptyProduct);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((products?.length ?? 0) / pageSize)),
    [products?.length, pageSize]
  );

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
  const [deletingImageId, setDeletingImageId] = useState(null);

  const updateProductForm = (patch) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const updateImageForm = (patch) =>
    setImageForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openCreate = () => {
    setForm(emptyProduct);
    setIsCreateOpen(true);
    if (categories.length === 0) {
      dispatch(fetchCategories());
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
      dispatch(fetchCategories());
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
        showToast("Completa nombre, precio, stock y categoría.", "error");
        return;
      }
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: form.category_id,
      };

      await dispatch(createAdminProduct(body)).unwrap();
      setIsCreateOpen(false);
      setForm(emptyProduct);
      showToast("Producto guardado exitosamente.", "success");
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      console.error(error);
      showToast(error?.message || "No se pudo guardar el producto.", "error");
    }
  };

  const updateProduct = async () => {
    try {
      if (!form.id) {
        showToast("Invalid product.", "error");
        return;
      }
      if (!form.name || !form.price || !form.stock || !form.category_id) {
        showToast("Complete name, price, stock and category.", "error");
        return;
      }
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: form.category_id,
      };
      await dispatch(
        updateAdminProduct({ productId: form.id, payload: body })
      ).unwrap();
      setIsEditOpen(false);
      setForm(emptyProduct);
      showToast("Product updated successfully.", "success");
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not update the product.", "error");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      setPendingProductDeleteId(id);
      await dispatch(deleteAdminProduct(id)).unwrap();
      showToast("Product deleted.", "success");
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not delete the product.", "error");
    } finally {
      setPendingProductDeleteId(null);
    }
  };

  const uploadImage = async () => {
    try {
      if (!imageProduct?.id) {
        showToast("Invalid product.", "error");
        return;
      }
      if (!imageForm.imageUrl) {
        showToast("Enter the image URL.", "error");
        return;
      }
      const body = {
        imageUrl: imageForm.imageUrl,
        altText: imageForm.altText,
        isPrimary: Boolean(imageForm.isPrimary),
        displayOrder: Number(imageForm.displayOrder),
      };
      await dispatch(
        uploadAdminProductImage({ productId: imageProduct.id, payload: body })
      ).unwrap();
      showToast("Image uploaded successfully.", "success");
      setIsImageOpen(false);
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not upload the image.", "error");
    }
  };

  const editImage = async () => {
    try {
      await dispatch(
        updateAdminProductImage({
          productId: imageProduct.id,
          imageId: imageForm.id,
          payload: {
            imageUrl: imageForm.imageUrl,
            altText: imageForm.altText,
            isPrimary: Boolean(imageForm.isPrimary),
            displayOrder: Number(imageForm.displayOrder),
          },
        })
      ).unwrap();
      showToast("Image edited successfully.", "success");
      setIsImageOpen(false);
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      showToast(error?.message || "Could not edit the image.", "error");
    }
  };

  const deleteImage = async (imageId) => {
    if (!imageProduct?.id) {
      showToast("Invalid product.", "error");
      return;
    }
    if (!confirm("Delete image?")) return;
    try {
      setDeletingImageId(imageId);
      await dispatch(
        deleteAdminProductImage({
          productId: imageProduct.id,
          imageId: imageId,
        })
      ).unwrap();
      showToast("Image deleted.", "success");
      setIsImageOpen(false);
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Could not delete the image.", "error");
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
        saving={isMutating}
        onClose={() => setIsCreateOpen(false)}
        onChange={updateProductForm}
        onSubmit={saveProduct}
      />

      <ProductEditModal
        isOpen={isEditOpen}
        form={form}
        categories={categories}
        categoriesLoading={categoriesLoading}
        saving={isMutating}
        onClose={() => setIsEditOpen(false)}
        onChange={updateProductForm}
        onSubmit={updateProduct}
      />

      <ProductImagesModal
        isOpen={isImageOpen}
        product={imageProduct}
        form={imageForm}
        editing={editingImage}
        saving={isMutating}
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
        loading={productsLoading}
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
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
};

export default ProductsAdmin;
