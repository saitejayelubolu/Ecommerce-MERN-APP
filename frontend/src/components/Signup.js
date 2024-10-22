import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

function Signup({ setUser }) {
  const [username, setUsername] = useState(""); // New state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    try {
      // Sending username along with email and password in the request
      console.log("1", username, email, password);

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("2");

      const token = response.data.token;
      localStorage.setItem("token", token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      setSuccess("Signup successful!");

      // Clear the form fields
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      setError("Signup failed, please try again");
    }
  };

  return (
    <div className="container ">
      <div className="row justify-content-center">
        <div className="card " style={{ width: "18rem" }}>
          <div className="card-head">
            <h2 className="text-center text-primary">Signup</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
          </div>
          <div className="card-body">
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="form-control"
                  autocomplete="username" // Add this
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="form-control"
                  autocomplete="email" // Add this
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="form-control"
                  autocomplete="current-password" // Add this
                />
              </div>
              <div className="form-group text-center pt-2">
                <button className="btn btn-success" type="submit">
                  Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
