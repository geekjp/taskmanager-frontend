import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
const Register = () => {
  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 //showToast function rendering
  const { showToast } = useToast();
  /*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

  const registerUser = async (e) => {
  e.preventDefault();

  try {
    /*
    |------------------------------------------------------------------
    | Backend Request
    |------------------------------------------------------------------
    */
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    /*
    |------------------------------------------------------------------
    | Save Auth Data
    |------------------------------------------------------------------
    */
    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data.user));

    /*
    |------------------------------------------------------------------
    | Success Toast
    |------------------------------------------------------------------
    */
    showToast(
      res.data.message || "User registered successfully",
      "success"
    );

    /*
    |------------------------------------------------------------------
    | Redirect User
    |------------------------------------------------------------------
    */
    navigate("/tasks");

  } catch (error) {
    console.error("Register Error:", error.response?.data);

    showToast(
      error.response?.data?.message ||
      "Registration failed",
      "error"
    );
  }
};

  return (
    <div className="page">
      <form className="login-card" onSubmit={registerUser}>
        <h2>Create Account</h2>

        {/* Name Input */}

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email Input */}

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit Button */}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
