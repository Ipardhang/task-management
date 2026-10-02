import { useEffect, useState } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/websocket";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    connectWebSocket((data) => {
      let message = data.message;

      if (data.action === "CREATED") {
        message = "A new task was created";
      }

      if (data.action === "UPDATED") {
        message = "A task was updated";
      }

      if (data.action === "DELETED") {
        message = "A task was deleted";
      }

      const notification = {
        id: Date.now(),
        message,
        time: new Date().toLocaleTimeString(),
      };

      setNotifications((previous) => [
        notification,
        ...previous,
      ]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const unreadCount = notifications.length;

  return (
    <div className="notification-wrapper">
      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong>Notifications</strong>

            {notifications.length > 0 && (
              <button
                className="clear-notifications"
                onClick={() => setNotifications([])}
              >
                Clear
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="no-notifications">
              No new notifications
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  className="notification-item"
                  key={notification.id}
                >
                  <div className="notification-icon">
                    ✓
                  </div>

                  <div>
                    <p>{notification.message}</p>
                    <span>{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;