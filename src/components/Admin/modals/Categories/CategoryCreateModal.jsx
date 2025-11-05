import Button from "../../../UI/Button";
import Input from "../../../UI/Input";
import Modal from "../../../UI/Modal";

const CategoryCreateModal = ({
  isOpen,
  form,
  saving,
  onClose,
  onChange,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Nueva categoría"
    size="medium"
  >
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <Input
          type="text"
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="h-10 rounded-md"
          placeholder="Electrónica"
        />
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

export default CategoryCreateModal;
