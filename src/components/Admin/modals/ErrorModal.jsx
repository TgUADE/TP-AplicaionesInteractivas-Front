import Button from "../../UI/Button";
import Modal from "../../UI/Modal";

const ErrorModal = ({ isOpen, title, message, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title || "Error"}
    size="medium"
  >
    <div className="space-y-4">
      <p className="text-sm text-red-700 whitespace-pre-wrap">{message}</p>
      <div className="flex justify-end">
        <Button
          onClick={onClose}
          className="bg-black text-white rounded-full px-6 h-10"
        >
          Cerrar
        </Button>
      </div>
    </div>
  </Modal>
);

export default ErrorModal;
