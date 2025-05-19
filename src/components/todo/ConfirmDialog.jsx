export const Confirm = ({ todoName, action, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl border border-blue-500 transform transition-all duration-300 scale-100 
                    ring-1 ring-black ring-opacity-5 
                    relative before:absolute before:inset-0 before:rounded-lg before:shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] before:z-10
                    after:absolute after:inset-0 after:rounded-lg after:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] after:z-0
                    hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:border-blue-700 hover:scale-[1.02] hover:ring-blue-300 hover:ring-opacity-30">
        <div className="relative z-20">
          {todoName && (
            <p className="text-center font-medium text-lg mb-6 text-blue-700">
              Do you want to remove "{todoName}" from your list?
            </p>
          )}
          
          <div className="flex justify-center gap-3 mt-4">
            <button 
              data-testid="confirm-cancel-btn" 
              id="confirm-cancel-btn" 
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm shadow-sm border border-gray-300 transition-all hover:shadow"
            >
              Cancel
            </button>
            <button 
              data-testid="confirm-delete-btn" 
              id="confirm-delete-btn" 
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm shadow-sm border border-red-700 transition-all hover:shadow"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
