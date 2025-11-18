import Modal from "../UI/Modal";
import Button from "../UI/Button";

const ClearCartModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Clear Cart">
      <div className="space-y-4">
        <p className="text-gray-600">
          <strong>Are you sure you want to clear all items from your cart?</strong> <br /> This action cannot be undone.
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Clearing..." : "Clear Cart"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClearCartModal;