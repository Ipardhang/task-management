import { useNavigate } from "react-router-dom";

function TaskCard({ task, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>

        <span
          className={`priority ${task.priority?.toLowerCase()}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="task-description">
        {task.description || "No description"}
      </p>

      <div className="task-info">
        <span>
          Status: <strong>{task.status}</strong>
        </span>

        <span>
          Due: <strong>{task.dueDate || "No date"}</strong>
        </span>
      </div>

      <div className="task-actions">
        <button
          className="view-btn"
          onClick={() => navigate(`/tasks/${task.id}`)}
        >
          View
        </button>

        <button
          className="edit-btn"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;