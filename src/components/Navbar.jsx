import { Link, useNavigate } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Component: Navbar
|--------------------------------------------------------------------------
| Purpose:
| - Display navigation links
| - Show Login or Logout based on authentication
|--------------------------------------------------------------------------
*/
const Navbar = () => {

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Left side title */}
      <h3>Task Manager</h3>

      {/* Right side navigation */}
      <div className="navbar-right">

        {isLoggedIn ? (
          <>
            <Link to="/tasks">Tasks</Link>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}

      </div>

    </nav>
  );
};

export default Navbar;