import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
      }
    };

    loadTasks();
  }, [navigate]);

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

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>Task Manager</span>
        </div>

        <div className="nav-right">
          <button
            className="logout-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="dashboard-content profile-page">
        <div className="profile-header">
          <div>
            <p className="details-label">
              ACCOUNT
            </p>

            <h1>My Profile</h1>

            <p>
              Manage your account and view your
              productivity overview.
            </p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h2>{user.name || "User"}</h2>

            <p className="profile-email">
              {user.email || "No email available"}
            </p>

            <div className="profile-divider"></div>

            <div className="profile-info">
              <div>
                <span>Name</span>
                <strong>
                  {user.name || "User"}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {user.email || "Not available"}
                </strong>
              </div>

              <div>
                <span>Account ID</span>
                <strong>
                  {user.id || "N/A"}
                </strong>
              </div>
            </div>

            <button
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="profile-card">
            <div className="profile-card-heading">
              <div>
                <span>PRODUCTIVITY</span>
                <h2>Task Overview</h2>
              </div>

              <strong className="profile-percentage">
                {completionPercentage}%
              </strong>
            </div>

            <div className="profile-progress-track">
              <div
                className="profile-progress-fill"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p className="profile-progress-text">
              {completedTasks} of {totalTasks} tasks
              completed
            </p>

            <div className="profile-stat-grid">
              <div className="profile-stat">
                <span>Total</span>
                <strong>{totalTasks}</strong>
              </div>

              <div className="profile-stat">
                <span>Completed</span>
                <strong>{completedTasks}</strong>
              </div>

              <div className="profile-stat">
                <span>Pending</span>
                <strong>{pendingTasks}</strong>
              </div>

              <div className="profile-stat">
                <span>In Progress</span>
                <strong>{inProgressTasks}</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;