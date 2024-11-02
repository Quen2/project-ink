export default function ConfirmationModal({ message, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <div>
          <p>{message}</p>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
            onClick={onConfirm}
          >
            Valider
          </button>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
            onClick={() => {
              onClose(false);
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
