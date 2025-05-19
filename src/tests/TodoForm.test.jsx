import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoForm } from "../components/todo/TodoForm";
import { AddToDoDialog } from "../components/todo/AddToDoDialog";
import * as todoUtils from "../utils/todoUtils";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] ? store[key] : null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
  };
})();

// Mock the todoUtils functions
jest.mock("../utils/todoUtils", () => ({
  isOverdue: jest.fn().mockReturnValue(false),
  formatDateToLocalYYYYMMDD: jest.fn(date => date),
}));

// Mock the AddToDoDialog component
jest.mock("../components/todo/AddToDoDialog", () => ({
  AddToDoDialog: jest.fn(({ isOpen, onClose, addTodo }) => 
    isOpen ? (
      <div data-testid="mock-add-dialog">
        <input 
          type="text" 
          data-testid="task-input" 
          defaultValue="New Task" 
        />
        <input 
          type="date" 
          data-testid="date-input" 
          defaultValue="2023-12-31" 
        />
        <select data-testid="priority-select" defaultValue="Medium">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button 
          onClick={() => {
            addTodo("New Task", "2023-12-31", "Medium");
            onClose();
          }}
        >
          Add Todo Item
        </button>
        <button onClick={onClose} data-testid="cancel-button">Cancel</button>
      </div>
    ) : null
  ),
}));

describe("TodoForm Component", () => {
  const mockOnTodosChange = jest.fn();
  
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    
    // Clear localStorage mock
    localStorageMock.clear();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup initial todos in localStorage
    localStorageMock.getItem.mockImplementation(key => {
      if (key === "todoList") {
        return JSON.stringify([
          {
            id: 1,
            task: "Test Task 1",
            status: "Active",
            priority: "Medium",
            dueDate: "2023-12-31",
            ts: 1672531200000,
            Deleted: "N"
          },
          {
            id: 2,
            task: "Test Task 2",
            status: "Completed",
            priority: "High",
            dueDate: "2023-11-30",
            ts: 1669766400000,
            Deleted: "N"
          }
        ]);
      }
      return null;
    });
    
    // Mock window.dispatchEvent
    window.dispatchEvent = jest.fn();
  });

  test("renders todo list from localStorage", () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Check if tasks are rendered using testIDs
    expect(screen.getByTestId("todo-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("todo-row-2")).toBeInTheDocument();
  });

  test("filters todos based on search query", () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Get the search input using testID
    const searchInput = screen.getByTestId("search-input");
    
    // Type in search query
    fireEvent.change(searchInput, { target: { value: "Task 1" } });
    
    // Task 1 should be visible, Task 2 should not
    expect(screen.getByTestId("todo-row-1")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-row-2")).not.toBeInTheDocument();
  });

  test("clears search when clear button is clicked", () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Get the search input using testID
    const searchInput = screen.getByTestId("search-input");
    
    // Type in search query
    fireEvent.change(searchInput, { target: { value: "Task 1" } });
    
    // Clear button should appear
    const clearButton = screen.getByTestId("clear-search-button");
    
    // Click clear button
    fireEvent.click(clearButton);
    
    // Search should be cleared and both tasks should be visible
    expect(searchInput.value).toBe("");
    expect(screen.getByTestId("todo-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("todo-row-2")).toBeInTheDocument();
  });

  test("filters todos based on status", () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Get the status filter buttons using testID
    const completedFilter = screen.getByTestId("filter-completed");
    
    // Click on Completed filter
    fireEvent.click(completedFilter);
    
    // Task 2 (Completed) should be visible, Task 1 (Active) should not
    expect(screen.queryByTestId("todo-row-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("todo-row-2")).toBeInTheDocument();
  });

  test("completes todo when complete button is clicked", async () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Find complete button using testID
    const completeButton = screen.getByTestId("complete-button-1");
    
    // Click the complete button
    fireEvent.click(completeButton);
    
    // Check if localStorage was updated
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    // Check if onTodosChange was called
    expect(mockOnTodosChange).toHaveBeenCalled();
  });

  test("toggles include deleted todos when checkbox is clicked", () => {
    // Setup localStorage with a deleted todo
    localStorageMock.getItem.mockImplementation(key => {
      if (key === "todoList") {
        return JSON.stringify([
          {
            id: 1,
            task: "Test Task 1",
            status: "Active",
            priority: "Medium",
            dueDate: "2023-12-31",
            ts: 1672531200000,
            Deleted: "N"
          },
          {
            id: 3,
            task: "Deleted Task",
            status: "Active",
            priority: "Low",
            dueDate: "2023-10-31",
            ts: 1667174400000,
            Deleted: "Y"
          }
        ]);
      }
      return null;
    });
    
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Initially, deleted task should not be visible
    expect(screen.queryByText("Deleted Task")).not.toBeInTheDocument();
    
    // Find the include deleted checkbox using testID
    const includeDeletedCheckbox = screen.getByTestId("include-deleted-checkbox");
    
    // Click the checkbox
    fireEvent.click(includeDeletedCheckbox);
    
    // Now deleted task should be visible
    expect(screen.getByTestId("todo-row-3")).toBeInTheDocument();
  });

  test("shows active tasks when Active filter is selected", () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    fireEvent.click(screen.getByTestId("filter-active"));

    expect(screen.getByTestId("todo-row-1")).toBeInTheDocument(); // Active
    expect(screen.queryByTestId("todo-row-2")).not.toBeInTheDocument(); // Completed
  });

  test("handles empty todo list gracefully", () => {
    // Setup empty localStorage
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Should render without crashing
    expect(screen.getByTitle(/add a new todo item/i)).toBeInTheDocument();
  });

  test("calls onTodosChange with correct count on initial render", () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // onTodosChange should be called with 2 (the number of todos)
    expect(mockOnTodosChange).toHaveBeenCalledWith(2);
  });

  test("calls onTodosChange with correct count when todos are modified", async () => {
    render(<TodoForm onTodosChange={mockOnTodosChange} />);
    
    // Find complete button using testID
    const completeButton = screen.getByTestId("complete-button-1");
    
    // Click the complete button to modify todos
    fireEvent.click(completeButton);
    
    // Check if onTodosChange was called with 2 (the number of todos)
    await waitFor(() => {
      expect(mockOnTodosChange).toHaveBeenCalledWith(2);
    });
  });
});
