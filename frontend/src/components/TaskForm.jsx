import { useEffect, useState } from "react";

function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "PENDING");
      setPriority(task.priority || "MEDIUM");
      setDueDate(task.dueDate || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setPriority("MEDIUM");
      setDueDate("");
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });
  };

  return (
    <div className="form-overlay">
      <div className="task-form-card">
        <div className="form-header">
          <h2>{task ? "Edit Task" : "Create New Task"}</h2>

          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />

          <div className="form-row">
            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <label>Due Date</label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn">
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
