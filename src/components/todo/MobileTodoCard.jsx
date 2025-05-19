import React from "react";
import PriorityBadge from "../PriorityBadge";

const MobileTodoCard = ({ todo, onStart, onComplete, onDelete, isOverdue }) => {
  return (
    <div key={todo.id} className="todo-card">
      <div className="todo-card-field">
        <strong>Task:</strong> {todo.task}
      </div>
      <div className="todo-card-field">
        <strong>Status:</strong> {todo.status}
      </div>
      <div className="todo-card-field">
        <PriorityBadge level={todo.priority} />
      </div>
      <div className="todo-card-field">
        <strong>Due:</strong> 
        <span className={isOverdue ? "font-bold italic text-red-600 ml-1" : "ml-1"}>
          {todo.dueDate}
        </span>
      </div>
      <div className="todo-card-actions">
        {todo.status !== "Completed" && todo.status !== "Deleted" && (
          <button
            onClick={() => onComplete(todo.id)}
            className="todo-button-complete"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="todo-button-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MobileTodoCard;
