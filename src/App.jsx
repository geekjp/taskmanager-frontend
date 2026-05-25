// Import routing tools from react-router-dom
// These allow us to create different URLs inside our React app
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import page components
// These are the actual screens we want to render
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Navbar from "./components/Navbar";

/*
|--------------------------------------------------------------------------
| Function: isAuthenticated
|--------------------------------------------------------------------------
| Purpose:
| Checks whether the user is logged in.
|
| How?
| We check if a JWT token exists in browser localStorage.
|
| If token exists → user is logged in
| If no token → user is not logged in
*/
const isAuthenticated = () => {
  return localStorage.getItem("token");
};

/*
|--------------------------------------------------------------------------
| Component: PrivateRoute
|--------------------------------------------------------------------------
| Purpose:
| Protects routes that require authentication.
|
| children = the component wrapped inside this (like <Tasks />)
|
| Logic:
| If user is authenticated → render children (allow access)
| If not → redirect to /login
*/
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? (
    children // Show protected component
  ) : (
    <Navigate to="/login" />
  ); // Redirect to login page
};

const App = () => {
  /*
|--------------------------------------------------------------------------
| Theme State
|--------------------------------------------------------------------------
| Initialize theme from localStorage
|--------------------------------------------------------------------------

  useState(() => {}) this called 👉 Lazy Initialization meaning -Run only on first render
*/

  const [darkMode, setDarkMode] = useState(() => {
    // Read saved theme
    const savedTheme = localStorage.getItem("darkMode");

    // Convert string to boolean
    return savedTheme === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])
  return (
    /*
    |--------------------------------------------------------------------------
    | BrowserRouter
    |--------------------------------------------------------------------------
    | Enables routing in the entire app.
    | Without this, URL-based navigation won't work.
    */
    /*
    |--------------------------------------------------------------------------
    | Theme Wrapper
    |--------------------------------------------------------------------------
    | Applies dark/light class globally
    */
    <div className={darkMode ? "dark" : "light"}>
      <BrowserRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Global Navigation */}
        {/*
      |--------------------------------------------------------------------------
      | Routes
      |--------------------------------------------------------------------------
      | Container that holds all individual route definitions.
      */}
        <Routes>
          {/*
        |--------------------------------------------------------------------------
        | Login Route
        |--------------------------------------------------------------------------
        | When user visits:
        | http://localhost:5173/login
        |
        | Render the Login component
        */}
          <Route path="/login" element={<Login />} />

          {/*
        |--------------------------------------------------------------------------
        | Protected Tasks Route
        |--------------------------------------------------------------------------
        | When user visits:
        | http://localhost:5173/tasks
        |
        | We wrap <Tasks /> inside <PrivateRoute>
        | This ensures only logged-in users can access it.
        */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />

          {/*
        |--------------------------------------------------------------------------
        | Default Route (/)
        |--------------------------------------------------------------------------
        | When user visits:
        | http://localhost:5173/
        |
        | We automatically redirect based on login status:
        |
        | If logged in → go to /tasks
        | If not logged in → go to /login
        */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/tasks" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

// Export App so main.jsx can render it
export default App;
