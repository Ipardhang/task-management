import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        } else {
          setError(
            err.response?.data?.message || "Unable to load task"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="empty-state">
        <h2>Loading task...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h2>{error}</h2>

        <button
          className="add-task-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>Task Manager</span>
        </div>

        <button
          className="logout-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="dashboard-content">
        <div className="task-details-card">
          <div className="task-details-header">
            <div>
              <p className="details-label">TASK DETAILS</p>
              <h1>{task.title}</h1>
            </div>

            <span
              className={`priority ${task.priority?.toLowerCase()}`}
            >
              {task.priority}
            </span>
          </div>

          <div className="task-details-section">
            <h3>Description</h3>

            <p>
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="task-details-grid">
            <div className="detail-item">
              <span>Status</span>
              <strong>{task.status}</strong>
            </div>

            <div className="detail-item">
              <span>Priority</span>
              <strong>{task.priority}</strong>
            </div>

            <div className="detail-item">
              <span>Due Date</span>
              <strong>{task.dueDate || "No due date"}</strong>
            </div>

            <div className="detail-item">
              <span>Created</span>
              <strong>
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString()
                  : "Unknown"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Last Updated</span>
              <strong>
                {task.updatedAt
                  ? new Date(task.updatedAt).toLocaleString()
                  : "Unknown"}
              </strong>
            </div>
          </div>

          <button
            className="add-task-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Tasks
          </button>
        </div>
      </main>
    </div>
  );
}

export default TaskDetails;