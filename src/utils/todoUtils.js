/**
 * Converts a "YYYY-MMM-DD" string to a Date object
 * @param {string} dateStr 
 * @returns {Date}
 */
export const parseCustomDate = (dateStr) => {
  const [year, monthStr, day] = dateStr.split("-");
  const monthIndex = new Date(`${monthStr} 1, 2000`).getMonth(); // "May" => 4
  return new Date(Number(year), monthIndex, Number(day));
};

/**
 * Formats a Date object to 'YYYY-MM-DD' in local time
 * @param {Date} dt - A valid JavaScript Date object
 * @returns {string} Formatted date string
 */
export const formatDateToLocalYYYYMMDD = (dt) => {
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns today's date with time zeroed (midnight)
 * @returns {Date}
 */
export const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Checks if a todo item is overdue
 * @param {Object} todo Todo item object with `dueDate` in "YYYY-MM-DD" format
 * @returns {boolean}
 */
export const isOverdue = (todo) => {
  return (
    todo.status !== "Completed" &&
    todo.Deleted !== "Y" &&
    new Date(todo.dueDate) < getTodayDate()
  );
};

/**
 * Gets todo counts from localStorage
 * @returns {Object} { todoCount, overdueCount }
 */
export const getTodoCounts = () => {
  const storedTodos = localStorage.getItem("todoList");
  if (!storedTodos) {
    return { todoCount: 0, overdueCount: 0 };
  }

  const todos = JSON.parse(storedTodos);
  // Filter out deleted tasks
  const activeTodos = todos.filter(todo => todo.Deleted !== "Y");
  const todoCount = activeTodos.length;

  const overdueTasks = activeTodos.filter(isOverdue);

  return {
    todoCount,
    overdueCount: overdueTasks.length
  };
};
