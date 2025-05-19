import { useState, useEffect } from "react";
import { TodoForm } from "../components/todo/TodoForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTodoCounts } from "../utils/todoUtils";

const Home = () => {
  const [todoCount, setTodoCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  // Get the count from localStorage on initial load and listen for changes
  useEffect(() => {
    const updateCounts = () => {
      const { todoCount, overdueCount } = getTodoCounts();
      setTodoCount(todoCount);
      setOverdueCount(overdueCount);
    };

    // Initial count
    updateCounts();

    // Listen for storage events (for cross-tab updates)
    window.addEventListener("storage", updateCounts);
    
    // Listen for custom events (for same-tab updates)
    const handleTodosUpdated = () => {
      updateCounts();
    };
    
    window.addEventListener("todosUpdated", handleTodosUpdated);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("todosUpdated", handleTodosUpdated);
    };
  }, []);

  return (
    <>
      <Header todoCount={todoCount} overdueCount={overdueCount} />
      <TodoForm onTodosChange={setTodoCount} />
      <Footer />
    </>
  );
}

export default Home;
