import React from "react";

interface ModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const BridgeModal: React.FC<ModalProps> = ({
  isOpen,
  loading,
  onClose,
  onApprove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
        <div className="flex justify-end">
          <button
            className="bg-red-600 px-2 py-1 rounded mr-2 align-right"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-4">Approve Bridge</h2>
        <p className="mb-4">
          Do you want to approve the transaction for bridging token?
        </p>
        <div className="flex justify-center">
          <button
            className="bg-green-600 px-4 py-2 rounded"
            onClick={onApprove}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Making Transaction...
              </div>
            ) : (
              "Approve Transaction"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BridgeModal;
