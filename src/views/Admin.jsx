import { useEffect, useMemo, useState } from "react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { useAuth } from "../hook/useAuth";
import Modal from "../components/UI/Modal";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const API_BASE = "/api";

const emptyProduct = {
  id: null,
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
};

const Admin = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("productos"); // única pestaña por ahora
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyProduct);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage]);
  const [pendingProductDeleteId, setPendingProductDeleteId] = useState(null);

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageProduct, setImageProduct] = useState(null);
  const [imageForm, setImageForm] = useState({
    imageUrl: "",
    altText: "",
    isPrimary: true,
    displayOrder: 1,
  });
  const [savingImage, setSavingImage] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  //Promociones
  const [promotions, setPromotions] = useState([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
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
  const [promotionForm, setPromotionForm] = useState(emptyPromotion);
  const [isPromotionCreateOpen, setIsPromotionCreateOpen] = useState(false);
  const [isPromotionEditOpen, setIsPromotionEditOpen] = useState(false);
  const [savingPromotion, setSavingPromotion] = useState(false);
  const [pendingPromotionId, setPendingPromotionId] = useState(null);

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const openError = (title, message) => {
    setErrorModal({ open: true, title, message });
  };
  const closeError = () => {
    setErrorModal({ open: false, title: "", message: "" });
  };

  //Categorias
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    description: "",
  });
  const [savingCategory, setSavingCategory] = useState(false);

  //Usuarios
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  //Ordenes
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPageSize = 20;

  const ordersTotalPages = Math.max(
    1,
    Math.ceil(orders.length / ordersPageSize)
  );
  const pagedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ordersPageSize;
    return orders.slice(start, start + ordersPageSize);
  }, [orders, ordersPage]);

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const [orderProductsModal, setOrderProductsModal] = useState({
    open: false,
    items: [],
    orderId: null,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (activeTab === "categorias") {
      fetchCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "usuarios") fetchUsers();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "ordenes") fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(orders.length / ordersPageSize));
    if (ordersPage > tp) setOrdersPage(tp);
  }, [orders]);

  // Al entrar a la pestaña promociones, cargar promociones

  useEffect(() => {
    if (activeTab === "promociones") {
      fetchPromotions();
    }
  }, [activeTab]);
  useEffect(() => {
    const handler = () => {
      if (activeTab === "promociones") fetchPromotions();
    };
    window.addEventListener("promotions_updated", handler);
    return () => window.removeEventListener("promotions_updated", handler);
  }, [activeTab]);

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(products.length / pageSize));
    if (currentPage > tp) setCurrentPage(tp);
  }, [products]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Error cargando usuarios");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/orders`, { headers: authHeaders });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Error cargando órdenes");
    } finally {
      setOrdersLoading(false);
    }
  };

  const parseOrderItems = (o) => {
    if (!o) return [];
    if (Array.isArray(o.products)) return o.products;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.orderItems)) return o.orderItems;
    if (o.productsJson) {
      try {
        const arr =
          typeof o.productsJson === "string"
            ? JSON.parse(o.productsJson)
            : o.productsJson;
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const openOrderProducts = (order) => {
    setOrderProductsModal({
      open: true,
      items: parseOrderItems(order),
      orderId: order?.id ?? order?.orderId ?? null,
    });
  };

  const closeOrderProducts = () =>
    setOrderProductsModal((p) => ({ ...p, open: false }));

  // Helpers de mapeo de ítems
  const getItemName = (it) =>
    it?.productName ?? `Producto ${it?.product_id ?? ""}`;

  const getItemQty = (it) =>
    Number(it?.quantity ?? it?.qty ?? it?.amount ?? it?.count ?? 1);

  const getItemPrice = (it) =>
    Number(
      it?.price ?? it?.unit_price ?? it?.unitPrice ?? it?.product?.price ?? 0
    );

  const getItemSubtotal = (it) =>
    Number(it?.subtotal ?? getItemQty(it) * getItemPrice(it));

  // Fechas backend: agrega :00 si falta segundos
  const toBackendDate = (s) => (s ? (s.length === 16 ? `${s}:00` : s) : "");

  // Fetch
  const fetchPromotions = async () => {
    setPromotionsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/promotions`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Error cargando promociones");
    } finally {
      setPromotionsLoading(false);
    }
  };

  const exportUsersToCSV = () => {
    if (!users?.length) {
      alert("No hay usuarios para exportar");
      return;
    }
    const headers = [
      "name",
      "surname",
      "email",
      "phone",
      "city",
      "state",
      "address",
      "zip",
      "country",
    ];
    const escapeCSV = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      // Comas, comillas o saltos de línea → encerrar en comillas y escapar comillas
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const rows = users.map((u) =>
      [
        u.name,
        u.surname,
        u.email,
        u.phone,
        u.city,
        u.state,
        u.address,
        u.zip,
        u.country,
      ]
        .map(escapeCSV)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Error cargando categorías");
    } finally {
      setCategoriesLoading(false);
    }
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
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error creando producto");
      setIsCreateOpen(false);
      setForm(emptyProduct);
      await fetchAll();
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const pRes = await fetch(`${API_BASE}/products`);
      const pJson = await pRes.json();
      setProducts(Array.isArray(pJson) ? pJson : []);
    } catch (e) {
      console.error(e);
      alert("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name ?? "",
      description: p.description ?? "",
      price: p.price ?? p.original_price ?? "",
      stock: p.stock ?? "",
      category_id: p.category?.id ?? p.category_id ?? "",
    });
    setIsEditOpen(true);
    if (categories.length === 0) fetchCategories();
  };

  const updateProduct = async () => {
    try {
      if (!form.id) return alert("Producto inválido");
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
      const res = await fetch(`${API_BASE}/products/${form.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error editando producto");
      setIsEditOpen(false);
      setForm(emptyProduct);
      await fetchAll();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const openCreateCategory = () => {
    setCategoryForm({ id: null, description: "" });
    setIsCategoryCreateOpen(true);
  };

  const openEditCategory = (c) => {
    setCategoryForm({ id: c.id, description: c.description ?? "" });
    setIsCategoryEditOpen(true);
  };

  const saveCategory = async () => {
    try {
      if (!categoryForm.description?.trim()) {
        alert("Ingresa una descripción");
        return;
      }
      setSavingCategory(true);
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ description: categoryForm.description.trim() }),
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error creando categoría");
      setIsCategoryCreateOpen(false);
      setCategoryForm({ id: null, description: "" });
      await fetchCategories();
    } catch (e) {
      console.error(e);
      alert(e.message);
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
      const res = await fetch(`${API_BASE}/categories/${categoryForm.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ description: categoryForm.description.trim() }),
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error editando categoría");
      setIsCategoryEditOpen(false);
      setCategoryForm({ id: null, description: "" });
      await fetchCategories();
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const deleteCategoryById = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error eliminando categoría");
      await fetchCategories();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const openImageModal = (p) => {
    setImageProduct(p);
    setImageForm({
      imageUrl: "",
      altText: "",
      isPrimary: true,
      displayOrder: 1,
    });
    setIsImageOpen(true);
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
      const res = await fetch(
        `${API_BASE}/products/${imageProduct.id}/images`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(body),
        }
      );
      if (!res.ok)
        throw new Error((await res.text()) || "Error subiendo imagen");
      alert("Imagen subida");
      setIsImageOpen(false);
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setSavingImage(false);
    }
  };

  const openCreate = () => {
    setForm(emptyProduct);
    setIsCreateOpen(true);
    if (categories.length === 0) {
      fetchCategories();
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      setPendingProductDeleteId(id);
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error eliminando producto");
      await fetchAll();
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setPendingProductDeleteId(null);
    }
  };

  const openCreatePromotion = () => {
    setPromotionForm(emptyPromotion);
    setIsPromotionCreateOpen(true);
    if (products.length === 0) fetchAll(); // para el selector de productos
  };

  const savePromotion = async () => {
    try {
      const valueNum = Number(promotionForm.value);

      // Validación UI (opcional pero útil para evitar 500)
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
      const res = await fetch(`${API_BASE}/promotions`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = "";
        try {
          const txt = await res.text();
          try {
            const json = JSON.parse(txt);
            msg = json.message || json.error || txt;
          } catch {
            msg = txt;
          }
        } catch {
          msg = "Error creando promoción";
        }
        openError("Error creando promoción", msg);
        return;
      }

      setIsPromotionCreateOpen(false);
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (e) {
      openError("Error creando promoción", e?.message || "Error desconocido");
    } finally {
      setSavingPromotion(false);
    }
  };

  // Editar
  const openEditPromotion = (p) => {
    setPromotionForm({
      id: p.id,
      name: p.name ?? "",
      description: p.description ?? "",
      type: p.type ?? "PERCENTAGE",
      value: p.value ?? "",
      start_date: (p.start_date || "").slice(0, 19), // si viene con segundos/zone
      end_date: (p.end_date || "").slice(0, 19),
      product_id: p.product_id ?? p.product?.id ?? "",
      active: !!p.active,
    });
    setIsPromotionEditOpen(true);
    if (products.length === 0) fetchAll();
  };

  const updatePromotion = async () => {
    try {
      if (!promotionForm.id)
        return openError("Error actualizando promoción", "Promoción inválida");

      const valueNum = Number(promotionForm.value);

      // Validación UI (opcional)
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
      const res = await fetch(`${API_BASE}/promotions/${promotionForm.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = "";
        try {
          const txt = await res.text();
          try {
            const json = JSON.parse(txt);
            msg = json.message || json.error || txt;
          } catch {
            msg = txt;
          }
        } catch {
          msg = "Error actualizando promoción";
        }
        openError("Error actualizando promoción", msg);
        return;
      }

      setIsPromotionEditOpen(false);
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (e) {
      openError(
        "Error actualizando promoción",
        e?.message || "Error desconocido"
      );
    } finally {
      setSavingPromotion(false);
    }
  };

  // Eliminar
  const deletePromotion = async (id) => {
    if (!confirm("¿Eliminar promoción?")) return;
    try {
      const res = await fetch(`${API_BASE}/promotions/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error eliminando promoción");
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  // Activar/Desactivar
  const activatePromotion = async (id) => {
    console.log("activatePromotion", id);
    try {
      setPendingPromotionId(id);
      const res = await fetch(`${API_BASE}/promotions/${id}/activate`, {
        method: "PUT",
        headers: authHeaders,
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error activando promoción");
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setPendingPromotionId(null);
    }
  };
  const deactivatePromotion = async (id) => {
    try {
      setPendingPromotionId(id);
      const res = await fetch(`${API_BASE}/promotions/${id}/deactivate`, {
        method: "PUT",
        headers: authHeaders,
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Error desactivando promoción");
      await fetchPromotions();
      window.dispatchEvent(new Event("promotions_updated"));
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setPendingPromotionId(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar izquierda */}
      <aside className="w-64 border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Configuración</h2>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab("productos")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "productos"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab("promociones")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "promociones"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Promociones
          </button>
          <button
            onClick={() => setActiveTab("categorias")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "categorias"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Categorías
          </button>

          <button
            onClick={() => setActiveTab("usuarios")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "usuarios"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Usuarios
          </button>

          <button
            onClick={() => setActiveTab("ordenes")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "ordenes"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Ordenes
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {/* Productos */}
        {activeTab === "productos" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Productos</h1>
                <p className="text-gray-500">Administra tus productos.</p>
              </div>
              <Button
                onClick={openCreate}
                className="bg-black text-white rounded-full px-6 h-10"
              >
                Nuevo producto
              </Button>
            </div>

            <div className="bg-white rounded-2xl border">
              {loading ? (
                <div className="p-6">Cargando...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Precio</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Categoría</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedProducts.map((p) => (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="px-4 py-3">{p.name}</td>
                          <td className="px-4 py-3">${p.original_price}</td>
                          <td className="px-4 py-3">{p.stock}</td>
                          <td className="px-4 py-3">
                            {p.category_name ?? "-"}
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <Button
                              onClick={() => openImageModal(p)}
                              className="h-9 px-4 rounded-full border"
                            >
                              Fotos
                            </Button>
                            <Button
                              onClick={() => openEdit(p)}
                              className="h-9 px-4 rounded-full border"
                            >
                              Editar
                            </Button>
                            <Button
                              onClick={() => deleteProduct(p.id)}
                              className="h-9 px-4 rounded-full border bg-red-600 text-white"
                              disabled={pendingProductDeleteId === p.id}
                              aria-busy={pendingProductDeleteId === p.id}
                            >
                              {pendingProductDeleteId === p.id ? (
                                <LoadingSpinner size="small" color="white" />
                              ) : (
                                "Eliminar"
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td className="px-4 py-6" colSpan={5}>
                            Sin productos
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5}>
                          <div className="flex items-center justify-between p-4 border-t">
                            <div className="text-sm text-gray-600">
                              {products.length > 0 ? (
                                <>
                                  Mostrando{" "}
                                  <span className="font-medium">
                                    {(currentPage - 1) * pageSize + 1}
                                  </span>
                                  {" - "}
                                  <span className="font-medium">
                                    {Math.min(
                                      products.length,
                                      currentPage * pageSize
                                    )}
                                  </span>{" "}
                                  de{" "}
                                  <span className="font-medium">
                                    {products.length}
                                  </span>
                                </>
                              ) : (
                                "Sin productos"
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="h-9 px-3"
                              >
                                Anterior
                              </Button>

                              {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                              ).map((n) => (
                                <button
                                  key={n}
                                  onClick={() => setCurrentPage(n)}
                                  className={`h-9 min-w-9 px-3 rounded-md border text-sm ${
                                    n === currentPage
                                      ? "bg-black text-white border-black"
                                      : "bg-white hover:bg-gray-50"
                                  }`}
                                >
                                  {n}
                                </button>
                              ))}

                              <Button
                                variant="outline"
                                onClick={() =>
                                  setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                  )
                                }
                                disabled={currentPage === totalPages}
                                className="h-9 px-3"
                              >
                                Siguiente
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promociones */}
        {activeTab === "promociones" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Promociones</h1>
                <p className="text-gray-500">Administra tus promociones.</p>
              </div>
              <Button
                onClick={openCreatePromotion}
                className="bg-black text-white rounded-full px-6 h-10"
              >
                Nueva promoción
              </Button>
            </div>

            <div className="bg-white rounded-2xl border">
              {promotionsLoading ? (
                <div className="p-6">Cargando...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Tipo</th>
                        <th className="px-4 py-3">Valor</th>
                        <th className="px-4 py-3">Producto</th>
                        <th className="px-4 py-3">Inicio</th>
                        <th className="px-4 py-3">Fin</th>
                        <th className="px-4 py-3">Activa</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotions.map((pr) => (
                        <tr key={pr.id} className="border-b last:border-0">
                          <td className="px-4 py-3">{pr.name}</td>
                          <td className="px-4 py-3">{pr.type}</td>
                          <td className="px-4 py-3">{pr.value}</td>
                          <td className="px-4 py-3">
                            {pr.product_name ??
                              pr.product?.name ??
                              pr.product_id ??
                              "-"}
                          </td>
                          <td className="px-4 py-3">
                            {pr.start_date
                              ? new Date(pr.start_date).toLocaleString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {pr.end_date
                              ? new Date(pr.end_date).toLocaleString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {pr.active ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Sí
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <Button
                              onClick={() => openEditPromotion(pr)}
                              className="h-9 px-4 rounded-full border"
                            >
                              Editar
                            </Button>
                            {pr.active ? (
                              <Button
                                onClick={() => deactivatePromotion(pr.id)}
                                className="h-9 px-4 rounded-full border"
                                disabled={pendingPromotionId === pr.id}
                              >
                                {pendingPromotionId === pr.id ? (
                                  <LoadingSpinner size="small" color="gray" />
                                ) : (
                                  "Desactivar"
                                )}
                              </Button>
                            ) : (
                              <Button
                                onClick={() => activatePromotion(pr.id)}
                                className="h-9 px-4 rounded-full border"
                                disabled={pendingPromotionId === pr.id}
                              >
                                {pendingPromotionId === pr.id ? (
                                  <LoadingSpinner size="small" color="gray" />
                                ) : (
                                  "Activar"
                                )}
                              </Button>
                            )}
                            <Button
                              onClick={() => deletePromotion(pr.id)}
                              className="h-9 px-4 rounded-full border bg-red-600 text-white"
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {promotions.length === 0 && (
                        <tr>
                          <td className="px-4 py-6" colSpan={8}>
                            Sin promociones
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categorias */}

        {activeTab === "categorias" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Categorías</h1>
                <p className="text-gray-500">Administra tus categorías.</p>
              </div>
              <Button
                onClick={openCreateCategory}
                className="bg-black text-white rounded-full px-6 h-10"
              >
                Nueva categoría
              </Button>
            </div>

            <div className="bg-white rounded-2xl border">
              {categoriesLoading ? (
                <div className="p-6">Cargando...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Descripción</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="px-4 py-3">{c.description}</td>
                          <td className="px-4 py-3 space-x-2">
                            <Button
                              onClick={() => openEditCategory(c)}
                              className="h-9 px-4 rounded-full border"
                            >
                              Editar
                            </Button>
                            <Button
                              onClick={() => deleteCategoryById(c.id)}
                              className="h-9 px-4 rounded-full border bg-red-600 text-white"
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr>
                          <td className="px-4 py-6" colSpan={2}>
                            Sin categorías
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Usuarios */}
        {activeTab === "usuarios" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Usuarios</h1>
                <p className="text-gray-500">
                  Listado de usuarios para campañas.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={exportUsersToCSV}
                  className="bg-black text-white rounded-full px-6 h-10"
                >
                  Exportar Excel
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border">
              {usersLoading ? (
                <div className="p-6">Cargando...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Apellido</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Direccion</th>
                        <th className="px-4 py-3">Ciudad</th>
                        <th className="px-4 py-3">Codigo Postal</th>
                        <th className="px-4 py-3">Pais</th>
                        <th className="px-4 py-3">Telefono</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(
                        (u) => (
                          console.log(u),
                          (
                            <tr key={u.id} className="border-b last:border-0">
                              <td className="px-4 py-3">{u.name ?? "-"}</td>
                              <td className="px-4 py-3">{u.surname ?? "-"}</td>
                              <td className="px-4 py-3">{u.email ?? "-"}</td>
                              <td className="px-4 py-3">{u.address ?? "-"}</td>
                              <td className="px-4 py-3">{u.city ?? "-"}</td>
                              <td className="px-4 py-3">{u.zip ?? "-"}</td>
                              <td className="px-4 py-3">{u.country ?? "-"}</td>
                              <td className="px-4 py-3">{u.phone ?? "-"}</td>
                            </tr>
                          )
                        )
                      )}
                      {users.length === 0 && (
                        <tr>
                          <td className="px-4 py-6" colSpan={5}>
                            Sin usuarios
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ordenes */}
        {activeTab === "ordenes" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Ordenes</h1>
                <p className="text-gray-500">Listado de todas las órdenes.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border">
              {ordersLoading ? (
                <div className="p-6">Cargando...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Metodo de Pago</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Producto</th>
                        <th className="px-4 py-3">Direccion Facturacion</th>
                        <th className="px-4 py-3">Direccion Envio</th>
                        <th className="px-4 py-3">Creada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedOrders.map((o) => (
                        <tr
                          key={o.id ?? o.orderId}
                          className="border-b last:border-0"
                        >
                          <td className="px-4 py-3">
                            {o.user?.email ?? o.customerEmail ?? o.email ?? "-"}
                          </td>
                          <td className="px-4 py-3">
                            {o.totalAmount ?? o.total ?? o.amount ?? "-"}
                          </td>
                          <td className="px-4 py-3">
                            {o.paymentMethod ?? "-"}
                          </td>
                          <td className="px-4 py-3">{o.status ?? "-"}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openOrderProducts(o)}
                              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                              title="Ver productos de la orden"
                            >
                              <span className="inline-block">▶</span>
                              <span>{parseOrderItems(o).length}</span>
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            {o.billing_address ?? o.billingAddress ?? "-"}
                          </td>
                          <td className="px-4 py-3">
                            {o.shipping_address ?? o.shippingAddress ?? "-"}
                          </td>
                          <td className="px-4 py-3">
                            {o.createdAt
                              ? new Date(o.createdAt).toLocaleString()
                              : o.created_at
                              ? new Date(o.created_at).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td className="px-4 py-6" colSpan={5}>
                            Sin órdenes
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5}>
                          <div className="flex items-center justify-between p-4 border-t">
                            <div className="text-sm text-gray-600">
                              {orders.length > 0 ? (
                                <>
                                  Mostrando{" "}
                                  <span className="font-medium">
                                    {(ordersPage - 1) * ordersPageSize + 1}
                                  </span>
                                  {" - "}
                                  <span className="font-medium">
                                    {Math.min(
                                      orders.length,
                                      ordersPage * ordersPageSize
                                    )}
                                  </span>{" "}
                                  de{" "}
                                  <span className="font-medium">
                                    {orders.length}
                                  </span>
                                </>
                              ) : (
                                "Sin órdenes"
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setOrdersPage((p) => Math.max(1, p - 1))
                                }
                                disabled={ordersPage === 1}
                                className="h-9 px-3"
                              >
                                Anterior
                              </Button>

                              {Array.from(
                                { length: ordersTotalPages },
                                (_, i) => i + 1
                              ).map((n) => (
                                <button
                                  key={n}
                                  onClick={() => setOrdersPage(n)}
                                  className={`h-9 min-w-9 px-3 rounded-md border text-sm ${
                                    n === ordersPage
                                      ? "bg-black text-white border-black"
                                      : "bg-white hover:bg-gray-50"
                                  }`}
                                >
                                  {n}
                                </button>
                              ))}

                              <Button
                                variant="outline"
                                onClick={() =>
                                  setOrdersPage((p) =>
                                    Math.min(ordersTotalPages, p + 1)
                                  )
                                }
                                disabled={ordersPage === ordersTotalPages}
                                className="h-9 px-3"
                              >
                                Siguiente
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Nuevo producto"
          size="large"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 rounded-md"
                placeholder="Producto Test"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <Input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="h-10 rounded-md"
                placeholder="Descripción del producto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Precio</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="h-10 rounded-md"
                  placeholder="99.99"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Stock</label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="h-10 rounded-md"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Categoría</label>
              <select
                className="border rounded-md h-10 px-3 w-full"
                disabled={categoriesLoading}
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">
                  {categoriesLoading ? "Cargando..." : "Seleccione categoría"}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.description ?? c.name ?? c.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={saveProduct}
                className="bg-black text-white rounded-full px-6 h-10"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={isImageOpen}
          onClose={() => setIsImageOpen(false)}
          title={
            imageProduct ? `Subir imagen: ${imageProduct.name}` : "Subir imagen"
          }
          size="large"
        >
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-semibold">Imágenes cargadas</h4>

            {imageProduct?.images?.length > 0 ? (
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2">Preview</th>
                      <th className="px-3 py-2">URL</th>
                      <th className="px-3 py-2">Alt</th>
                      <th className="px-3 py-2">Principal</th>
                      <th className="px-3 py-2">Orden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imageProduct.images
                      .slice() // copia para no mutar
                      .sort(
                        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
                      )
                      .map((img) => (
                        <tr key={img.id} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <img
                              src={img.imageUrl}
                              alt={img.altText || "preview"}
                              className="h-12 w-12 object-cover rounded border"
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="px-3 py-2 max-w-[280px]">
                            <a
                              href={img.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {img.imageUrl}
                            </a>
                          </td>
                          <td className="px-3 py-2">{img.altText || "-"}</td>
                          <td className="px-3 py-2">
                            {img.isPrimary ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Sí
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {img.displayOrder ?? "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-600 border rounded-md p-3">
                Este producto aún no tiene imágenes.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">URL de la imagen</label>
              <Input
                type="url"
                value={imageForm.imageUrl}
                onChange={(e) =>
                  setImageForm({ ...imageForm, imageUrl: e.target.value })
                }
                className="h-10 rounded-md"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Alt text</label>
              <Input
                type="text"
                value={imageForm.altText}
                onChange={(e) =>
                  setImageForm({ ...imageForm, altText: e.target.value })
                }
                className="h-10 rounded-md"
                placeholder="Imagen del producto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">¿Es principal?</label>
                <select
                  className="border rounded-md h-10 px-3 w-full"
                  value={String(imageForm.isPrimary)}
                  onChange={(e) =>
                    setImageForm({
                      ...imageForm,
                      isPrimary: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Orden de visualización
                </label>
                <Input
                  type="number"
                  value={imageForm.displayOrder}
                  onChange={(e) =>
                    setImageForm({ ...imageForm, displayOrder: e.target.value })
                  }
                  className="h-10 rounded-md"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsImageOpen(false)}
                disabled={savingImage}
              >
                Cancelar
              </Button>
              <Button
                onClick={uploadImage}
                className="bg-black text-white rounded-full px-6 h-10"
                disabled={savingImage}
              >
                {savingImage ? "Subiendo..." : "Subir"}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Editar producto"
          size="large"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 rounded-md"
                placeholder="Nombre"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <Input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="h-10 rounded-md"
                placeholder="Descripción"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Precio</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="h-10 rounded-md"
                  placeholder="99.99"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Stock</label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="h-10 rounded-md"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Categoría</label>
              <select
                className="border rounded-md h-10 px-3 w-full"
                disabled={categoriesLoading}
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">
                  {categoriesLoading ? "Cargando..." : "Seleccione categoría"}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.description ?? c.name ?? c.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={updateProduct}
                className="bg-black text-white rounded-full px-6 h-10"
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </Modal>

        {/* Categorias */}
        <Modal
          isOpen={isCategoryCreateOpen}
          onClose={() => setIsCategoryCreateOpen(false)}
          title="Nueva categoría"
          size="medium"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <Input
                type="text"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                className="h-10 rounded-md"
                placeholder="Electrónica"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCategoryCreateOpen(false)}
                disabled={savingCategory}
              >
                Cancelar
              </Button>
              <Button
                onClick={saveCategory}
                className="bg-black text-white rounded-full px-6 h-10"
                disabled={savingCategory}
              >
                {savingCategory ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isCategoryEditOpen}
          onClose={() => setIsCategoryEditOpen(false)}
          title="Editar categoría"
          size="medium"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <Input
                type="text"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                className="h-10 rounded-md"
                placeholder="Descripción"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCategoryEditOpen(false)}
                disabled={savingCategory}
              >
                Cancelar
              </Button>
              <Button
                onClick={updateCategory}
                className="bg-black text-white rounded-full px-6 h-10"
                disabled={savingCategory}
              >
                {savingCategory ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Promociones */}
        <Modal
          isOpen={isPromotionCreateOpen}
          onClose={() => setIsPromotionCreateOpen(false)}
          title="Nueva promoción"
          size="large"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <Input
                type="text"
                value={promotionForm.name}
                onChange={(e) =>
                  setPromotionForm({ ...promotionForm, name: e.target.value })
                }
                className="h-10 rounded-md"
                placeholder="Black Friday"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <Input
                type="text"
                value={promotionForm.description}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    description: e.target.value,
                  })
                }
                className="h-10 rounded-md"
                placeholder="Descuento especial"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Tipo</label>
                <select
                  className="border rounded-md h-10 px-3 w-full"
                  value={promotionForm.type}
                  onChange={(e) =>
                    setPromotionForm({ ...promotionForm, type: e.target.value })
                  }
                >
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FIXED_AMOUNT">FIXED_AMOUNT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Valor</label>
                <Input
                  type="number"
                  step="0.01"
                  value={promotionForm.value}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      value: e.target.value,
                    })
                  }
                  className="h-10 rounded-md"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Inicio</label>
                <Input
                  type="datetime-local"
                  value={promotionForm.start_date}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      start_date: e.target.value,
                    })
                  }
                  className="h-10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Fin</label>
                <Input
                  type="datetime-local"
                  value={promotionForm.end_date}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      end_date: e.target.value,
                    })
                  }
                  className="h-10 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Producto</label>
              <select
                className="border rounded-md h-10 px-3 w-full"
                value={promotionForm.product_id}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    product_id: e.target.value,
                  })
                }
              >
                <option value="">Seleccione producto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="promo-active"
                type="checkbox"
                checked={!!promotionForm.active}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    active: e.target.checked,
                  })
                }
              />
              <label htmlFor="promo-active" className="text-sm">
                Activa
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsPromotionCreateOpen(false)}
                disabled={savingPromotion}
              >
                Cancelar
              </Button>
              <Button
                onClick={savePromotion}
                className="bg-black text-white rounded-full px-6 h-10"
                disabled={savingPromotion}
              >
                {savingPromotion ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={isPromotionEditOpen}
          onClose={() => setIsPromotionEditOpen(false)}
          title="Editar promoción"
          size="large"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <Input
                type="text"
                value={promotionForm.name}
                onChange={(e) =>
                  setPromotionForm({ ...promotionForm, name: e.target.value })
                }
                className="h-10 rounded-md"
                placeholder="Black Friday"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <Input
                type="text"
                value={promotionForm.description}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    description: e.target.value,
                  })
                }
                className="h-10 rounded-md"
                placeholder="Descuento especial"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Tipo</label>
                <select
                  className="border rounded-md h-10 px-3 w-full"
                  value={promotionForm.type}
                  onChange={(e) =>
                    setPromotionForm({ ...promotionForm, type: e.target.value })
                  }
                >
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FIXED_AMOUNT">FIXED_AMOUNT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Valor</label>
                <Input
                  type="number"
                  step="0.01"
                  value={promotionForm.value}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      value: e.target.value,
                    })
                  }
                  className="h-10 rounded-md"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Inicio</label>
                <Input
                  type="datetime-local"
                  value={promotionForm.start_date}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      start_date: e.target.value,
                    })
                  }
                  className="h-10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Fin</label>
                <Input
                  type="datetime-local"
                  value={promotionForm.end_date}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      end_date: e.target.value,
                    })
                  }
                  className="h-10 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Producto</label>
              <select
                className="border rounded-md h-10 px-3 w-full"
                value={promotionForm.product_id}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    product_id: e.target.value,
                  })
                }
              >
                <option value="">Seleccione producto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="promo-edit-active"
                type="checkbox"
                checked={!!promotionForm.active}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    active: e.target.checked,
                  })
                }
              />
              <label htmlFor="promo-edit-active" className="text-sm">
                Activa
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsPromotionEditOpen(false)}
                disabled={savingPromotion}
              >
                Cancelar
              </Button>
              <Button
                onClick={updatePromotion}
                className="bg-black text-white rounded-full px-6 h-10"
                disabled={savingPromotion}
              >
                {savingPromotion ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={errorModal.open}
          onClose={closeError}
          title={errorModal.title || "Error"}
          size="medium"
        >
          <div className="space-y-4">
            <p className="text-sm text-red-700 whitespace-pre-wrap">
              {errorModal.message}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={closeError}
                className="bg-black text-white rounded-full px-6 h-10"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
        {/* Modal de productos de la orden */}
        <Modal
          isOpen={orderProductsModal.open}
          onClose={closeOrderProducts}
          title={`Productos de la orden`}
          size="large"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderProductsModal.items.length ? (
                  orderProductsModal.items.map((it, idx) => {
                    const name = getItemName(it);
                    const qty = getItemQty(it);
                    const price = getItemPrice(it);
                    const subtotal = getItemSubtotal(it);
                    return (
                      <tr
                        key={it.id ?? it.productId ?? it.product_id ?? idx}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3">{name}</td>
                        <td className="px-4 py-3">{qty}</td>
                        <td className="px-4 py-3">${price}</td>
                        <td className="px-4 py-3">${subtotal}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-4 py-6" colSpan={4}>
                      Sin productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-3">
            <Button
              onClick={closeOrderProducts}
              className="bg-black text-white rounded-full px-6 h-10"
            >
              Cerrar
            </Button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Admin;
