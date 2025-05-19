import { useState, useEffect, useCallback } from "react";
import { AddToDoDialog } from "./AddToDoDialog";
import PriorityBadge from "../PriorityBadge";
import { Confirm } from "./ConfirmDialog";
import MobileTodoCard from "./MobileTodoCard";
import { isOverdue, formatDateToLocalYYYYMMDD } from "../../utils/todoUtils";

export const TodoForm = ({ onTodosChange }) => {
  const useLocalStorage = (key, initialValue) => {
    const getStoredValue = () => {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    };

    const [value, setValue] = useState(getStoredValue);

    const saveValue = useCallback((newValue) => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
      
      // Notify about changes
      if (onTodosChange) {
        onTodosChange(newValue.length);
      }
      
      // Dispatch a custom event for other components
      const event = new CustomEvent("todosUpdated", { detail: newValue });
      window.dispatchEvent(event);
    }, [key]);

    return [value, saveValue];
  };

  const initialTodos = [
    {
      id: 1,
      task: "Welcome! This is your first task",
      status: "Active",
      priority: "Medium",
      dueDate: "2025-12-31",
      ts: Date.now(),
      Deleted: "N"
    },
  ];

  const [todos, setTodos] = useLocalStorage("todoList", initialTodos);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  // Add new state for including deleted tasks
  const [includeDeleted, setIncludeDeleted] = useState(false);
  
  // manage state for dialog visibility
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // validation functions for the dialog
  const isTaskValid = (task) => task.trim().length > 0;
  const isDateValid = (date) => date && new Date(date) >= new Date().setHours(0, 0, 0, 0);
  
  // function to add a new todo
  const addTodo = useCallback((task, dueDate, priority) => {
    const newTodo = {
      id: Date.now(),
      task,
      status: "Active",
      priority,
      dueDate,
      ts: Date.now(),
      Deleted: "N"
    };
    setTodos([...todos, newTodo]);
  }, [todos, setTodos]);

  const completeTodo = useCallback((id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, status: "Completed" } : todo
    );
    setTodos(updated);
  }, [todos, setTodos]);

  // manage state for confirm dialog
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  
  // Modify delete function to show confirmation first
  const deleteTodo = useCallback((id) => {
    setTodoToDelete(id);
    setShowConfirmModal(true);
  }, []);
  
  // Function to handle confirmed deletion - now sets Deleted flag to "Y"
  const confirmDelete = useCallback(() => {
    if (todoToDelete) {
      const updated = todos.map((todo) => 
        todo.id === todoToDelete ? { ...todo, Deleted: "Y" } : todo
      );
      setTodos(updated);
      setTodoToDelete(null);
      setShowConfirmModal(false);
    }
  }, [todoToDelete, todos, setTodos]);
  
  // function to handle cancel
  const handleCancelDelete = useCallback(() => {
    setTodoToDelete(null);
    setShowConfirmModal(false);
  }, []);

  const startTodo = useCallback((id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, status: "Active" } : todo
    );
    setTodos(updated);
  }, [todos, setTodos]);

  const reopenTodo = useCallback((id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, status: "Active" } : todo
    );
    setTodos(updated);
  }, [todos, setTodos]); 

  const handleSearch = (e) => setSearchQuery(e.target.value);

  // manage state for sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  
  // function to handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // get sorted items
  const getSortedItems = (items) => {
    if (!sortConfig.key) return items;
    
    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Get sorted and filtered todos
  const sortedAndFilteredTodos = getSortedItems(filteredTodos);
  
  // function to get the sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Add a function to style the due date cell based on overdue status
  const getDueDateClassName = (todo) => {
    if (isOverdue(todo)) {
      return "text-center font-bold italic text-red-600";
    }
    return "text-center text-slate-700";
  };

  // Add restore function
  const restoreTodo = useCallback((id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, Deleted: "N" } : todo
    );
    setTodos(updated);
  }, [todos, setTodos]);

  useEffect(() => {
    // Filter based on deletion status
    let results = includeDeleted 
      ? todos 
      : todos.filter(todo => todo.Deleted !== "Y");

    if (activeStatus !== "All") {
      results = results.filter((todo) => todo.status === activeStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((todo) =>
        todo.task.toLowerCase().includes(q)
      );
    }

    setFilteredTodos(results);
  }, [todos, searchQuery, activeStatus, includeDeleted]);

  // Toggle handler for the include deleted checkbox
  const handleIncludeDeletedChange = (e) => {
    setIncludeDeleted(e.target.checked);
  };

  useEffect(() => {
    // Call onTodosChange with initial todos count
    if (onTodosChange) {
      onTodosChange(todos.filter(todo => todo.Deleted !== "Y").length);
    }
  }, [onTodosChange, todos]);

  return (
    <div className="container mx-auto px-4">
      <div className="w-full py-6">
        {/* Filters + Search + Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-100 p-4 rounded shadow mb-6">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-4 justify-center" data-testid="status-filters">
            {["All", "Active", "Completed"].map((status) => (
              <label key={status} className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  defaultChecked={status === "All"}
                  onChange={() => setActiveStatus(status)}
                  className="mr-2 border border-slate-300 p-1 rounded"
                  data-testid={`filter-${status.toLowerCase()}`}
                />
                <span className="text-sm text-slate-700">{status}</span>
              </label>
            ))}
            
            {/* Include Deleted Checkbox */}
            <label className="inline-flex items-center ml-4 border-l pl-4 border-slate-300">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={handleIncludeDeletedChange}
                className="mr-2 border border-slate-300 p-1 rounded"
                data-testid="include-deleted-checkbox"
              />
              <span className="text-sm text-slate-700">Include Deleted</span>
            </label>
          </div>

          {/* Search */}
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full border border-slate-300 rounded px-4 py-2 text-sm text-slate-700"
              data-testid="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-sm text-indigo-600 hover:text-indigo-700"
                data-testid="clear-search-button"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Add Button */}
          <div>
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors duration-150"
              title="Add a new ToDo item"
              data-testid="add-todo-button"
            >
              +
            </button>
          </div>
        </div>

        {/* Desktop Table View with Sortable Headers */}
        <div className="hidden md:block" data-testid="desktop-todo-table">
          <table className="w-full table-auto border border-slate-200 shadow rounded overflow-hidden">
            <thead className="bg-indigo-100">
              <tr>
                <th 
                  className="px-4 py-2 text-left text-slate-700 cursor-pointer hover:bg-indigo-200"
                  onClick={() => requestSort('task')}
                  data-testid="sort-by-task"
                >
                  Task{getSortDirectionIndicator('task')}
                </th>
                <th 
                  className="px-4 py-2 text-center text-slate-700 cursor-pointer hover:bg-indigo-200"
                  onClick={() => requestSort('status')}
                  data-testid="sort-by-status"
                >
                  Status{getSortDirectionIndicator('status')}
                </th>
                <th 
                  className="px-4 py-2 text-center text-slate-700 cursor-pointer hover:bg-indigo-200"
                  onClick={() => requestSort('priority')}
                  data-testid="sort-by-priority"
                >
                  Priority{getSortDirectionIndicator('priority')}
                </th>
                <th 
                  className="px-4 py-2 text-center text-slate-700 cursor-pointer hover:bg-indigo-200"
                  onClick={() => requestSort('dueDate')}
                  data-testid="sort-by-dueDate"
                >
                  Due{getSortDirectionIndicator('dueDate')}
                </th>
                <th 
                  className="px-4 py-2 text-center text-slate-700 cursor-pointer hover:bg-indigo-200"
                  onClick={() => requestSort('ts')}
                  data-testid="sort-by-ts"
                >
                  Created At{getSortDirectionIndicator('ts')}
                </th>
                <th className="px-4 py-2 text-center text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredTodos.map((todo) => (
                <tr 
                  key={todo.id} 
                  className={`odd:bg-white even:bg-slate-50 hover:bg-indigo-50 transition-colors duration-150 ease-in-out cursor-pointer ${todo.Deleted === "Y" ? "opacity-60" : ""}`}
                  data-testid={`todo-row-${todo.id}`}
                >
                  <td className="px-4 py-2 text-slate-700">
                    {todo.task}
                    {todo.Deleted === "Y" && (
                      <span className="ml-2 text-xs italic text-rose-600">(deleted)</span>
                    )}
                  </td>
                  <td className="text-center text-slate-700">{todo.status}</td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <PriorityBadge level={todo.priority} />
                    </div>
                  </td>
                  <td className={getDueDateClassName(todo)}>{todo.dueDate}</td>
                  <td className="text-center text-slate-700">{formatDateToLocalYYYYMMDD(new Date(todo.ts))}</td>
                  <td className="flex justify-center gap-2 py-2">
                    {todo.Deleted === "Y" ? (
                      <button
                        onClick={() => restoreTodo(todo.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm transition-colors duration-150"
                        data-testid={`restore-button-${todo.id}`}
                      >
                        Restore
                      </button>
                    ) : (
                      <>
                        {todo.status !== "Completed" && (
                          <button
                            onClick={() => completeTodo(todo.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm transition-colors duration-150"
                            data-testid={`complete-button-${todo.id}`}
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded text-sm transition-colors duration-150"
                          data-testid={`delete-button-${todo.id}`}
                        >
                          Delete
                        </button>
                        {todo.status === "Completed" && (
                          <button
                            onClick={() => reopenTodo(todo.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors duration-150"
                            data-testid={`reopen-button-${todo.id}`}
                          >
                            ReOpen
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Update to handle deleted tasks */}
        <div className="md:hidden space-y-4" data-testid="mobile-todo-list">
          {sortedAndFilteredTodos.map((todo) => (
            <MobileTodoCard
              key={todo.id}
              todo={todo}
              onStart={startTodo}
              onComplete={completeTodo}
              onDelete={deleteTodo}
              onRestore={restoreTodo}
              isOverdue={isOverdue(todo)}
            />
          ))}
        </div>
        
        {/* Add Todo Dialog */}
        <AddToDoDialog
          addTodo={addTodo}
          isTaskValid={isTaskValid}
          isDateValid={isDateValid}
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
        
        {/* Confirm Delete Dialog */}
        {showConfirmModal && (
          <Confirm 
            todoName={todoToDelete ? todos.find((todo) => todo.id === todoToDelete).task : ""}
            action = 'delete'
            onConfirm={confirmDelete} 
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
};
