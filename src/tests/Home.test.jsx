import { render, screen } from "@testing-library/react";
import Home from "../pages/Home";

const todoCount = 0;
const overdueCount = 0;

describe("Home Component", () => {
  test("displays Heading message", () => {
    expect(() => render(<Home todoCount={todoCount} overdueCount={overdueCount} />)).not.toThrow();

    // Match heading semantically
    const heading = screen.getByRole('heading', {
      name: /manage your todo list/i
    });
    expect(heading).toBeInTheDocument();
  });

  test("displays Copyright message", () => {
    expect(() => render(<Home todoCount={todoCount} overdueCount={overdueCount} />)).not.toThrow();
    const copyright = screen.getByText(/©\s*2025\s*ToDo App/i);
    expect(copyright).toBeInTheDocument();
  });
  test("displays Add message", () => {
    expect(() => render(<Home todoCount={todoCount} overdueCount={overdueCount} />)).not.toThrow();
    const addButton = screen.getByTitle(/add a new todo item/i);
    expect(addButton).toBeInTheDocument();
  });

  test("displays task count message", () => {
    expect(() => render(<Home todoCount={todoCount} overdueCount={overdueCount} />)).not.toThrow();
    const message = screen.getByText(/items\s+in your list/i);
    expect(message).toBeInTheDocument();
  });

  test("displays task table column headers", () => {
    // Desktop and Mobile UI elements - some items duplicated
    expect(() => render(<Home todoCount={todoCount} overdueCount={overdueCount} />)).not.toThrow();
    const taskElements = screen.getAllByText(/task/i);
    expect(taskElements.length).toBeGreaterThan(1);
    const statusElements = screen.getAllByText(/task/i);
    expect(statusElements.length).toBeGreaterThan(1);
    expect(screen.getByText(/priority/i)).toBeInTheDocument();
    const dueElements = screen.getAllByText(/due/i);
    expect(dueElements.length).toBeGreaterThan(1);
    expect(screen.getByText(/created at/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });
});