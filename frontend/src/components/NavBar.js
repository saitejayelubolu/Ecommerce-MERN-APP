import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
function NavBar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav className="container pt-4 pb-4 d-flex justify-content-center">
      <div className="p-2">
        <button className="btn btn-info " onClick={() => navigate("/")}>
          Home
        </button>
      </div>

      {user ? (
        <>
          {user.role === "admin" && (
            <div className="text-end p-2">
              <button
                className="btn btn-success "
                onClick={() => navigate("/admin")}
              >
                Admin Dashboard
              </button>
            </div>
          )}
          <div className="text-end p-2">
            <button className="btn btn-danger " onClick={onLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-2 text-end">
            <button
              className="btn btn-success "
              onClick={() => navigate("/login")}
            >
              login
            </button>
          </div>
          <div className="p-2 text-end">
            <button
              className="btn btn-primary "
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </div>
        </>
      )}
    </nav>
  );
}

export default NavBar;
