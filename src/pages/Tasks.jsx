import { useEffect, useState } from "react";
import api from "../services/api";

const Tasks = () => {

  // State to store tasks from backend
  const [tasks, setTasks] = useState([]);

  /*
  -----------------------------------
  Runs once when page loads
  -----------------------------------
  */
  useEffect(() => {
    fetchTasks();
  }, []);

  /*
  -----------------------------------
  Fetch protected tasks
  Axios automatically adds JWT
  -----------------------------------
  */
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      // Save tasks into React state
      setTasks(res.data.data.items);

    } catch (error) {
      console.log("Fetch error:", error.response?.data);
    }
  };

  return (
    <div className="container">

      <h2>Your Tasks</h2>

      {/* Display tasks */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map(task => (
          <p key={task._id}>
            {task.title}
          </p>
        ))
      )}

    </div>
  );
};

export default Tasks;
