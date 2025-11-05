import Button from "../../../UI/Button";
import Input from "../../../UI/Input";
import Modal from "../../../UI/Modal";

const PromotionCreateModal = ({
  isOpen,
  form,
  saving,
  products,
  onClose,
  onChange,
  onSubmit,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Nueva promoción" size="large">
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Nombre</label>
        <Input
          type="text"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="h-10 rounded-md"
          placeholder="Black Friday"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <Input
          type="text"
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="h-10 rounded-md"
          placeholder="Descuento especial"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Tipo</label>
          <select
            className="border rounded-md h-10 px-3 w-full"
            value={form.type}
            onChange={(e) => onChange({ type: e.target.value })}
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
            value={form.value}
            onChange={(e) => onChange({ value: e.target.value })}
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
            value={form.start_date}
            onChange={(e) => onChange({ start_date: e.target.value })}
            className="h-10 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Fin</label>
          <Input
            type="datetime-local"
            value={form.end_date}
            onChange={(e) => onChange({ end_date: e.target.value })}
            className="h-10 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Producto</label>
        <select
          className="border rounded-md h-10 px-3 w-full"
          value={form.product_id}
          onChange={(e) => onChange({ product_id: e.target.value })}
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
          checked={!!form.active}
          onChange={(e) => onChange({ active: e.target.checked })}
        />
        <label htmlFor="promo-active" className="text-sm">
          Activa
        </label>
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

export default PromotionCreateModal;
