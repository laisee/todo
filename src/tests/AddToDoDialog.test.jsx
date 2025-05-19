import { render, screen, fireEvent } from "@testing-library/react";
import { AddToDoDialog } from "../components/todo/AddToDoDialog";

describe("AddToDoDialog Component", () => {
  const mockAddTodo = jest.fn();
  const mockOnClose = jest.fn();
  const mockIsTaskValid = jest.fn().mockImplementation(task => task.length > 0);
  const mockIsDateValid = jest.fn().mockImplementation(() => true);
  
  beforeEach(() => {
    // Reset mocks before each test
    mockAddTodo.mockReset();
    mockOnClose.mockReset();
    mockIsTaskValid.mockReset();
    mockIsDateValid.mockReset();
    
    // Default implementations
    mockIsTaskValid.mockImplementation(task => task.length > 0);
    mockIsDateValid.mockImplementation(() => true);
  });

  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <AddToDoDialog 
        addTodo={mockAddTodo}
        isTaskValid={mockIsTaskValid}
        isDateValid={mockIsDateValid}
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    
    // Container should be empty
    expect(container.firstChild).toBeNull();
  });

  test("renders dialog when isOpen is true", () => {
    render(
      <AddToDoDialog 
        addTodo={mockAddTodo}
        isTaskValid={mockIsTaskValid}
        isDateValid={mockIsDateValid}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    // Check if dialog title is rendered
    expect(screen.getByText(/Add New Todo/i)).toBeInTheDocument();
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
  });

  test("calls onClose when Cancel button is clicked", () => {
    render(
      <AddToDoDialog 
        addTodo={mockAddTodo}
        isTaskValid={mockIsTaskValid}
        isDateValid={mockIsDateValid}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    // Find and click the Cancel button
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test("calls addTodo with correct values when form is submitted", () => {
    // Create a proper mock date with toISOString method
    const mockDate = new Date("2023-01-01");
    const originalDate = global.Date;
    global.Date = jest.fn(() => mockDate);
    global.Date.now = originalDate.now;
    
    // Add toISOString method to our mock date
    mockDate.toISOString = jest.fn(() => "2023-01-01T00:00:00.000Z");
    
    render(
      <AddToDoDialog 
        addTodo={mockAddTodo}
        isTaskValid={mockIsTaskValid}
        isDateValid={mockIsDateValid}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    // Fill out the form
    const taskInput = screen.getByLabelText(/Task Description/i);
    fireEvent.change(taskInput, { target: { value: "New Test Task" } });
    
    const dateInput = screen.getByLabelText(/Due Date/i);
    fireEvent.change(dateInput, { target: { value: "2023-12-31" } });
    
    // Select High priority
    const highPriorityOption = screen.getByText(/🔥 High/i);
    fireEvent.click(highPriorityOption);
    
    // Submit the form
    const addButton = screen.getByText(/Add Todo Item/i); 
    fireEvent.click(addButton);
    
    // Check if addTodo was called with correct values
    expect(mockAddTodo).toHaveBeenCalledTimes(1);
    expect(mockAddTodo).toHaveBeenCalledWith("New Test Task", "2023-12-31", "High");
    
    // Check if onClose was called after submission
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    
    // Restore Date
    global.Date = originalDate;
  });

  test("disables Add button when task is invalid", () => {
    // Mock validation to return false
    mockIsTaskValid.mockImplementation(() => false);
    
    // Create a proper mock date with toISOString method
    const mockDate = new Date("2023-01-01");
    const originalDate = global.Date;
    global.Date = jest.fn(() => mockDate);
    global.Date.now = originalDate.now;
    
    // Add toISOString method to our mock date
    mockDate.toISOString = jest.fn(() => "2023-01-01T00:00:00.000Z");
    
    render(
      <AddToDoDialog 
        addTodo={mockAddTodo}
        isTaskValid={mockIsTaskValid}
        isDateValid={mockIsDateValid}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    // Check if Add button is disabled
    const addButton = screen.getByText(/Add Todo Item/i);
    expect(addButton).toBeDisabled();
    
    // Click the button anyway (shouldn't do anything)
    fireEvent.click(addButton);
    
    // Check that addTodo wasn't called
    expect(mockAddTodo).not.toHaveBeenCalled();
    
    // Restore Date
    global.Date = originalDate;
  });

  test("disables Add button when date is invalid", () => {
    // Mock date validation to return false
    mockIsDateValid.mockImplementation(() => false);
    
    // Create a proper mock date with toISOString method
    const mockDate = new Date("2023-01-01");
    const originalDate = global.Date;
    global.Date = jest.fn(() => mockDate);
    global.Date.now = originalDate.now;
    
    // Add toISOString method to our mock date
    mockDate.toISOString = jest.fn(() => "2023-01-01T00:00:00.000Z");
    
    render(
      <AddToDoDialog 
        addTodo={mockAddTodo}
        isTaskValid={mockIsTaskValid}
        isDateValid={mockIsDateValid}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    // Check if Add button is disabled
    const addButton = screen.getByText(/Add Todo Item/i);
    expect(addButton).toBeDisabled();
    
    // Click the button anyway (shouldn't do anything)
    fireEvent.click(addButton);
    
    // Check that addTodo wasn't called
    expect(mockAddTodo).not.toHaveBeenCalled();
    
    // Restore Date
    global.Date = originalDate;
  });
});
