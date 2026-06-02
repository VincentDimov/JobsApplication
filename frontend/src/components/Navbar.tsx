import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg">Recruitment Admin</span>
        <Link to="/jobs" className="hover:underline">
          Jobs & Kanban
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin/customers" className="hover:underline">
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        {user && (
          <>
            <span className="opacity-80">
              {user.role}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs"
            >
              Logga ut
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
