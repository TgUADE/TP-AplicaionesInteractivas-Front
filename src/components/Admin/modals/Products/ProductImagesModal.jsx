import Button from "../../../UI/Button";
import Input from "../../../UI/Input";
import Modal from "../../../UI/Modal";

const sortImages = (images = []) =>
  images.slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

const ProductImagesModal = ({
  isOpen,
  product,
  form,
  editing,
  saving,
  deletingImageId,
  onClose,
  onChangeForm,
  onUpload,
  onEdit,
  onOpenEditImage,
  onDeleteImage,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={
      product
        ? `${editing ? "Editar" : "Subir"} imagen: ${product?.name ?? ""}`
        : "Imágenes del producto"
    }
    size="large"
    className="max-w-4xl"
  >
    <div className="space-y-2 mb-4">
      <h4 className="text-sm font-semibold">Imágenes cargadas</h4>

      {product?.images?.length ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2">Preview</th>
                <th className="px-3 py-2">URL</th>
                <th className="px-3 py-2">Alt</th>
                <th className="px-3 py-2">Principal</th>
                <th className="px-3 py-2">Orden</th>
                <th className="px-3 py-2"></th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {sortImages(product.images).map((img) => (
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
                  <td className="px-3 py-2">{img.displayOrder ?? "-"}</td>
                  <td className="px-3 py-2">
                    <Button onClick={() => onOpenEditImage(img)}>Editar</Button>
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      onClick={() => onDeleteImage(img.id)}
                      disabled={deletingImageId === img.id}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {deletingImageId === img.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </Button>
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
          value={form.imageUrl}
          onChange={(e) => onChangeForm({ imageUrl: e.target.value })}
          className="h-10 rounded-md"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Alt text</label>
        <Input
          type="text"
          value={form.altText}
          onChange={(e) => onChangeForm({ altText: e.target.value })}
          className="h-10 rounded-md"
          placeholder="Imagen del producto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">¿Es principal?</label>
          <select
            className="border rounded-md h-10 px-3 w-full"
            value={String(form.isPrimary)}
            onChange={(e) =>
              onChangeForm({ isPrimary: e.target.value === "true" })
            }
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Orden de visualización</label>
          <Input
            type="number"
            value={form.displayOrder}
            onChange={(e) => onChangeForm({ displayOrder: e.target.value })}
            className="h-10 rounded-md"
            placeholder="1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={editing ? onEdit : onUpload}
          className="bg-black text-white rounded-full px-6 h-10"
          disabled={saving}
        >
          {saving
            ? editing
              ? "Editando..."
              : "Subiendo..."
            : editing
            ? "Editar"
            : "Subir"}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ProductImagesModal;
