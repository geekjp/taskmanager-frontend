/*
|--------------------------------------------------------------------------
| Tasks.jsx
|--------------------------------------------------------------------------
| Purpose:
| - Display user's tasks
| - Create new tasks
| - Update task title
| - Toggle task status
| - Delete tasks
| - Search tasks
|
| This is a protected page (JWT required).
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
const Tasks = () => {
  /* =========================================================================
     STATE SECTION
     ========================================================================= */

  // Stores tasks fetched from backend
  const [tasks, setTasks] = useState([]);

  // New task input value
  const [title, setTitle] = useState("");

  // Search input value
  const [searchTerm, setSearchTerm] = useState("");

  // Stores ID of task currently being edited
  const [editId, setEditId] = useState(null);

  // Stores text being edited
  const [editText, setEditText] = useState("");

  // Controls loading state for API requests
  const [loading, setLoading] = useState(false);

  //showToast function rendering
  const { showToast } = useToast();

  //Add pagination stats
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  /* =========================================================================
     EFFECT SECTION
     ========================================================================= */

  // Runs once when component mounts
  useEffect(() => {
    fetchTasks();
  }, [page]);

  /* =========================================================================
     DERIVED STATE
     ========================================================================= */

  /*
    filteredTasks:
    - Dynamically filters tasks based on search input
    - Case insensitive comparison
  */
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* =========================================================================
     API FUNCTIONS
     ========================================================================= */

  /*
  |--------------------------------------------------------------------------
  | Fetch Tasks
  |--------------------------------------------------------------------------
  | Fetches tasks from backend
  | Automatically sends JWT (via axios interceptor)
  */
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/tasks?page=${page}`);
      // Save tasks in state
      setTasks(res.data.tasks);
      setTotalPage(res.data.totalPages);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create Task
  |--------------------------------------------------------------------------
  | Sends POST request to backend
  | Clears input after success
  */
  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return; // Prevent empty task

    try {
      await api.post("/tasks", { title });

      setTitle(""); // Clear input
      fetchTasks(); // Refresh tasks
      showToast("Task created successfully");
    } catch (error) {
      showToast("Failed to create task", "error");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Task
  |--------------------------------------------------------------------------
  | Sends PUT request to update title
  | Optimistically updates UI
  */
  const updateTask = async (id) => {
    if (!editText.trim()) return;

    try {
      await api.put(`/tasks/${id}`, { title: editText });

      // Update only the modified task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, title: editText } : task,
        ),
      );

      // Exit edit mode
      setEditId(null);
      setEditText("");
      showToast("Task updated successfully");
    } catch (error) {
      showToast("Failed to update task", "error");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Task
  |--------------------------------------------------------------------------
  | Asks confirmation
  | Sends DELETE request
  | Removes from UI after success
  */
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${taskId}`);

      // Remove from state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      showToast("Task deleted successfully");
    } catch (error) {
      showToast("Failed to delete task", "error");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Task Status
  |--------------------------------------------------------------------------
  | Switches between pending & completed
  */
  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";

    try {
      await api.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      // Optimistic UI update
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, status: newStatus } : t,
        ),
      );
      showToast("Task status updated");
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  /* =========================================================================
     UI SECTION
     ========================================================================= */

  return (
    <div className="container">
      {/* ================= Header ================= */}
      <div className="tasks-header">
        <h2>Your Tasks</h2>

        <input
          type="text"
          placeholder="Search tasks..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <hr />

      {/* ================= Add Task ================= */}
      <h3 className="add-task-heading">Add Tasks</h3>

      <form onSubmit={createTask} className="add-task-form">
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="add-task-input"
        />

        <button type="submit" className="add-task-btn">
          Add Task
        </button>
      </form>

      {/* ================= Task List ================= */}

      {loading ? (
         <Loader />
      ) : filteredTasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        filteredTasks.map((task) => (
          <div key={task._id} className="task-item">
            {/* -------- Edit Mode -------- */}
            {editId === task._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                />

                <div className="task-actions">
                  <button onClick={() => updateTask(task._id)}>Save</button>

                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* -------- Normal Mode -------- */}
                <span
                  style={{
                    textDecoration:
                      task.status === "completed" ? "line-through" : "none",
                    opacity: task.status === "completed" ? 0.6 : 1,
                  }}
                >
                  {task.title}
                </span>

                <div className="task-actions">
                  <button onClick={() => toggleStatus(task)}>
                    {task.status === "pending" ? "Mark Done" : "Undo"}
                  </button>

                  <button
                    onClick={() => {
                      setEditId(task._id);
                      setEditText(task.title);
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page} of {totalPage}
        </span>

        <button
          disabled={page === totalPage}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Tasks;
