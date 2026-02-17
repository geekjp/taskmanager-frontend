// Import React hook that lets us store and update values
import { useState } from "react";

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
  const [email, setEmail] = useState("");//email = stored value, setEmail = function to change it, "" = starting value

  // Stores the password typed by user
  const [password, setPassword] = useState("");

  // Stores success/error message to show on screen
  const [message, setMessage] = useState("");



  /*
  -----------------------------------------
  LOGIN FUNCTION
  Runs when user clicks "Login"
  -----------------------------------------
  */
  const handleLogin = async (e) => {

    // Prevent browser page reload
    e.preventDefault();

    try {

      /*
      Send login request to backend

      React → Axios → Node backend
      */

      const res = await api.post("/auth/login", {
        email,
        password
      });

      /*
      Backend returns JWT token
      We store it in browser storage
      */
      localStorage.setItem(
        "token",
        res.data.data.token
      );

      // Show success message on UI
      setMessage("Login successful ✅");

      // Debug: view backend response in console
      console.log("Backend response:", res.data);

    } catch (error) {

      /*
      If login fails → show backend error
      */
      setMessage(
        error.response?.data?.message ||
        "Login failed ❌"
      );
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

      <h2>Welcome Back</h2>

      <form onSubmit={handleLogin}>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

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