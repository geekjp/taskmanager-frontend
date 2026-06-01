// Import React hook that lets us store and update values
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Import our axios API helper (used to talk to backend)
import api from "../services/api";
// Login component = a React screen
const Login = () => {
  /*
  -----------------------------------------
  STATE VARIABLES
  -----------------------------------------
  React state = memory for this component
  */

  // Stores the email typed by user
  const [email, setEmail] = useState(""); //email = stored value, setEmail = function to change it, "" = starting value

  // Hook used for programmatic navigation
  const navigate = useNavigate();

  // Stores the password typed by user
  const [password, setPassword] = useState("");

  // Stores success/error message to show on screen
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  /*
  -----------------------------------------
  LOGIN FUNCTION
  Runs when user clicks "Login"
  -----------------------------------------
  */
  const handleLogin = async (e) => {
    e.preventDefault();

    // ❌ Step 1: Validate BEFORE loader
    if (!email || !password) {
      setMessage("All fields are required ❌");
      return;
    }

    // Optional: Email format check
    if (!email.includes("@")) {
      setMessage("Please provide a valid email ❌");
      return;
    }

    try {
      setLoading(true); // ✅ start loader ONLY if valid

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      

      setMessage("Login successful ✅");

      // Redirect to tasks page
      navigate("/tasks");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false); // always stop loader
    }
  };

  /*
  -----------------------------------------
  UI (WHAT USER SEES)
  -----------------------------------------
  */
  return (
    <div className="page">
      <div className="login-card">
        <h2>Welcome</h2>

        <form onSubmit={handleLogin}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          {/*
          |--------------------------------------------------------------------------
          | Register Redirect
          |--------------------------------------------------------------------------
          */}
          <p style={{ marginTop: "15px" }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>

        <p className="message">{message}</p>
      </div>
    </div>
  );
};

// Export component so React can use it
export default Login;

/* IMPortant: If interviewer asks:

“What happens when user logs in?”

You say:

“React stores form input in state, submits credentials via Axios, waits for backend response, stores JWT token, and updates UI based on state.” */
