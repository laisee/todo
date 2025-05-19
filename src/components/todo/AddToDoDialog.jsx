
import { useState, useCallback } from "react";

export const AddToDoDialog = ({ addTodo, isTaskValid, isDateValid, isOpen, onClose }) => {
  // Form state
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newPriority, setPriority] = useState("Low");

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    addTodo(newTask, newDate, newPriority);
    setPriority("Low");
    setNewTask("");
    setNewDate(new Date().toISOString().split("T")[0]);
    onClose();
  }, [newTask, newDate, newPriority, addTodo, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl border border-blue-500 transform transition-all duration-300 hover:border-blue-700">
        <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Add New Todo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-input" className="block text-sm font-medium text-gray-700">Task Description</label>
            <input
              id="task-input"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description..."
              className="mt-1 block w-full border border-blue-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date-input" className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              id="date-input"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-1 block w-full border border-blue-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label id="priority-label" className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="flex gap-4" role="radiogroup" aria-labelledby="priority-label">
              {/* Low Priority */}
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={newPriority === "Low"}
                  onChange={(e) => setPriority(e.target.value)}
                  className="hidden"
                  aria-labelledby="low-priority-label"
                />
                <span 
                  id="low-priority-label"
                  className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium 
                  ${newPriority === "Low" ? 'bg-gray-200 text-gray-800 font-semibold' : 'bg-gray-100 text-gray-500'}`}>
                  🧘 Low
                </span>
              </label>

              {/* Medium Priority */}
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="Medium"
                  checked={newPriority === "Medium"}
                  onChange={(e) => setPriority(e.target.value)}
                  className="hidden"
                  aria-labelledby="medium-priority-label"
                />
                <span 
                  id="medium-priority-label"
                  className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium 
                  ${newPriority === "Medium" ? 'bg-yellow-200 text-yellow-800 font-semibold' : 'bg-yellow-100 text-yellow-600'}`}>
                  ⚠️ Medium
                </span>
              </label>

              {/* High Priority */}
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={newPriority === "High"}
                  onChange={(e) => setPriority(e.target.value)}
                  className="hidden"
                  aria-labelledby="high-priority-label"
                />
                <span 
                  id="high-priority-label"
                  className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium 
                  ${newPriority === "High" ? 'bg-red-200 text-red-800 font-semibold' : 'bg-red-100 text-red-600'}`}>
                  🔥 High
                </span>
              </label>
            </div>
          </div>


          <div className="flex justify-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded border border-gray-300 text-gray-700 font-medium transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isTaskValid(newTask) || !isDateValid(newDate)}
              className={`px-4 py-2 rounded font-medium transition-colors duration-150 ${
                isTaskValid(newTask) && isDateValid(newDate)
                  ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed border border-gray-500"
              }`}
            >
              Add Todo Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

