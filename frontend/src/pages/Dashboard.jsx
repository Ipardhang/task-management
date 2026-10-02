import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import NotificationBell from "../components/NotificationBell";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/websocket";
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadTasks = async () => {
    try {
      setError("");

      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        setError("Unable to load tasks");
      }
    }
  };

  useEffect(() => {
    loadTasks();
  
    connectWebSocket(() => {
      loadTasks();
    });
  
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleCreate = async (task) => {
    try {
      setError("");

      await api.post("/tasks", task);

      setShowForm(false);
      await loadTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create task"
      );
    }
  };

  const handleUpdate = async (task) => {
    try {
      setError("");

      await api.put(`/tasks/${editingTask.id}`, task);

      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update task"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/tasks/${id}`);

      await loadTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete task"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        task.title?.toLowerCase().includes(searchText) ||
        task.description?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "HIGH"
  ).length;

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const todayTasks = tasks.filter(
    (task) => task.dueDate === todayString
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "COMPLETED") {
      return false;
    }

    return task.dueDate < todayString;
  }).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
  };

  const hasFilters =
    search ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL";

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>Task Manager</span>
        </div>

        <div className="nav-right">
        <button
          className="profile-btn"
         onClick={() => navigate("/profile")}
         >
         👤 Profile
        </button>
        <NotificationBell />
          <span className="welcome">
            Hi, {user.name || "User"}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <h1>My Tasks</h1>

            <p>
              Manage your tasks and stay productive.
            </p>
          </div>

          <button
            className="add-task-btn"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            + New Task
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgressTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>

        {/* ANALYTICS */}

        <div className="analytics-grid">
          <div className="analytics-card progress-card">
            <div className="analytics-header">
              <div>
                <span>Overall Progress</span>
                <h2>{completionPercentage}%</h2>
              </div>

              <div className="progress-circle">
                <span>{completionPercentage}%</span>
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p>
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-title">
              <span>Task Overview</span>
            </div>

            <div className="overview-list">
              <div className="overview-item">
                <span>
                  <i className="dot pending-dot"></i>
                  Pending
                </span>

                <strong>{pendingTasks}</strong>
              </div>

              <div className="overview-item">
                <span>
                  <i className="dot progress-dot"></i>
                  In Progress
                </span>

                <strong>{inProgressTasks}</strong>
              </div>

              <div className="overview-item">
                <span>
                  <i className="dot completed-dot"></i>
                  Completed
                </span>

                <strong>{completedTasks}</strong>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-title">
              <span>Priority</span>
            </div>

            <div className="overview-list">
              <div className="overview-item">
                <span>
                  <i className="dot high-dot"></i>
                  High Priority
                </span>

                <strong>{highPriorityTasks}</strong>
              </div>

              <div className="overview-item">
                <span>
                  <i className="dot today-dot"></i>
                  Due Today
                </span>

                <strong>{todayTasks}</strong>
              </div>

              <div className="overview-item">
                <span>
                  <i className="dot overdue-dot"></i>
                  Overdue
                </span>

                <strong>{overdueTasks}</strong>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <div className="filters">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {hasFilters && (
            <button
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>

            <h2>No tasks yet</h2>

            <p>
              Create your first task to get started.
            </p>

            <button
              className="add-task-btn"
              onClick={() => setShowForm(true)}
            >
              Create Your First Task
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>

            <h2>No matching tasks</h2>

            <p>
              Try changing your search or filters.
            </p>

            <button
              className="add-task-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="results-count">
              Showing {filteredTasks.length} of{" "}
              {tasks.length} tasks
            </div>

            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(selectedTask) => {
                    setEditingTask(selectedTask);
                    setShowForm(false);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {showForm && (
          <TaskForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;