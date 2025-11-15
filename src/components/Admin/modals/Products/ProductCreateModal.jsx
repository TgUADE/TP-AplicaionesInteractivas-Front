import Button from "../../../UI/Button";
import Input from "../../../UI/Input";
import Modal from "../../../UI/Modal";

const ProductCreateModal = ({
  isOpen,
  form,
  categories = [],
  categoriesLoading = false,
  saving,
  onClose,
  onChange,
  onSubmit,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Nuevo producto" size="large">
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Nombre</label>
        <Input
          type="text"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="h-10 rounded-md"
          placeholder="Producto Test"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <Input
          type="text"
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
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
            onChange={(e) => onChange({ price: e.target.value })}
            className="h-10 rounded-md"
            placeholder="99.99"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Stock</label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => onChange({ stock: e.target.value })}
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
          onChange={(e) => onChange({ category_id: e.target.value })}
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
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-black text-white rounded-full px-6 h-10"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ProductCreateModal;
