import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainTemplate.css";

import logo from "../../assets/resoluteai.png";

const ProMain = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const defaultEmail = "admin@example.com";
    const defaultPassword = "admin123";
    if (email == defaultEmail && password == defaultPassword) {
      navigate("/dashboard/home");
    } else {
      setError("Invalid email or password");
    }
  };
  return (
    <div className="main-template-container">
      <div className="template-content-box">
        <h4>{"Landing Screen"}</h4>
      </div>

      <div className="template-login-box">
        <div
          className="template-logo"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* USE PRODUCT TITLE OR PRODUCT LOGO */}
          <h5
            style={{
              marginTop: "30px",
              fontSize: "25px",
              color: "red",
              // border: '2px solid red',
              //  padding:'20px 20px'
            }}
          >
            {" "}
            Real-Time Multilingual
          </h5>
          <h5
            style={{
              fontSize: "25px",
              color: "red",
              // border: '2px solid red',
              //  padding:'20px 20px'
            }}
          >
            Translation AI Agent System
          </h5>
          {/* <img 
            src={productLogo} 
            alt="productLogo" 
            className="template-dash" 
            style={{
              marginTop: '20px',
              width: "100px",
              height: "auto",
              maxHeight: "50px",
              objectFit: "contain"
            }} 
          /> */}
        </div>

        <form className="template-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <button type="submit">Sign In</button>
        </form>

        <div className="template-powered-by">
          <p
            className="powered"
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "2px",
            }}
          >
            Powered By
          </p>
          <img src={logo} alt="ResoluteAI Software" className="template-dash" />
        </div>
      </div>
    </div>
  );
};

export default ProMain;
