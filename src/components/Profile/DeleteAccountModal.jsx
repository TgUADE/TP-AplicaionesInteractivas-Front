import Modal from "../UI/Modal";
import Button from "../UI/Button";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      <div className="space-y-4">
    
        <p className="text-gray-600">
            <strong>Are you sure you want to delete your account?</strong> <br /> This action cannot be undone and all your data will be permanently removed.
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
            {isLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;