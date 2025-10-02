import React, { useState, useEffect, useRef } from "react";
import { BiBriefcase } from "react-icons/bi";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../styles/Prototype.css";
import clientlogo from "../../assets/clientlogo.png";
import ing from "../../assets/resoluteai.png";
import adminlogo from "../../assets/adminlogo.png";
import ZodhaGpt from "../../assets/ZodhaGpt.png";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isHamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [isAdminMenuOpen, setAdminMenuOpen] = useState(false);
  const [isHomeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const adminMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const wrapper = document.querySelector(".hamburger-hover-wrapper");
      if (wrapper && !wrapper.contains(event.target)) {
        setHamburgerMenuOpen(false);
      }
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard/home":
        return "Home";
      case "/dashboard/home/kt":
        return "KT Section";
      case "/dashboard/home/hardware":
        return "Hardware Setup";
      case "/dashboard/home/software":
        return "Software Setup";
      case "/dashboard/home/team":
        return "Project Team Architecture";
      default:
        return "";
    }
  };

  const currentPage = getPageTitle(location.pathname);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-container">
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="logo">
          <img src={ZodhaGpt} alt="ZodhaGpt Logo" />
        </div>

        <nav className="nav-links">
          {/* Home with Dropdown */}
          <div className="nav-button-wrapper">
            <NavLink
              to="/dashboard/home"
              className={({ isActive }) =>
                `nav-button ${isActive ? "active" : ""}`
              }
            >
              <FaHome />
              <span>Home</span>
            </NavLink>

            {/* Dropdown toggle only */}
            <button
              className={`dropdown-toggle ${isHomeDropdownOpen ? "open" : ""}`}
              onClick={() => setHomeDropdownOpen(!isHomeDropdownOpen)}
            >
              ▾
            </button>
          </div>

          {isHomeDropdownOpen && (
            <div className="dropdown-submenu">
              <NavLink
                to="/dashboard/home/kt"
                className={({ isActive }) =>
                  `sub-nav-button ${isActive ? "active" : ""}`
                }
              >
                KT Section
              </NavLink>
              <NavLink
                to="/dashboard/home/hardware"
                className={({ isActive }) =>
                  `sub-nav-button ${isActive ? "active" : ""}`
                }
              >
                Hardware Setup
              </NavLink>
              <NavLink
                to="/dashboard/home/software"
                className={({ isActive }) =>
                  `sub-nav-button ${isActive ? "active" : ""}`
                }
              >
                Software Setup
              </NavLink>
              <NavLink
                to="/dashboard/home/team"
                className={({ isActive }) =>
                  `sub-nav-button ${isActive ? "active" : ""}`
                }
              >
                Project Team Architecture
              </NavLink>
            </div>
          )}

          {/* Other pages */}
          <NavLink
            to="/dashboard/2d"
            end
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            <FaHome />
            <span>2D</span>
          </NavLink>
          <NavLink
            to="/dashboard/3d"
            end
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            <FaHome />
            <span>3D</span>
          </NavLink>
          <NavLink
            to="/dashboard/orgchart"
            end
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            <FaHome />
            <span>Org Chart</span>
          </NavLink>
          <NavLink
            to="/dashboard/users"
            end
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            <FaHome />
            <span>User Manager Org</span>
          </NavLink>
          <NavLink
            to="/dashboard/configuration"
            end
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            <FaHome />
            <span>Current Org</span>
          </NavLink>
        </nav>

        <div className="footer-logo">
          <p className="powered">Powered by</p>
          <img src={ing} alt="ResoluteAI" />
        </div>
      </div>

      <div className="main-content">
        <header className="app-header">
          <div className="sidebar-toggle-wrapper">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <div className="toggle-icon"></div>
            </button>
            <div className="current-page-title">
              <h3>{currentPage}</h3>
            </div>
          </div>
          <div className="hamburger-hover-wrapper">
            <button
              className="hamburger-toggle"
              onClick={() => setHamburgerMenuOpen((prev) => !prev)}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </button>
            {isHamburgerMenuOpen && (
              <div className="hover-nav-card">
                <button
                  className="nav-button"
                  onClick={() => {
                    navigate("/dashboard/home");
                    setHamburgerMenuOpen(false);
                  }}
                >
                  <FaHome /> <span>Home</span>
                </button>
              </div>
            )}
          </div>

          <h1>Real-Time Multilingual Translation AI Agent System</h1>
          <div className="app-client">
            <img src={clientlogo} alt="Client Logo" />
          </div>

          {/* Admin Dropdown */}
          <div className="app-logo" ref={adminMenuRef}>
            <img
              src={adminlogo}
              alt="admin Logo"
              className="admin-logo"
              onClick={() => setAdminMenuOpen((prev) => !prev)}
            />
            {isAdminMenuOpen && (
              <div className="admin-dropdown">
                <div className="dropdown-item user-info">
                  <FaUser className="icon" />
                  <span className="arjun">Admin</span>
                </div>

                <div className="dropdown-item admin-label">
                  <BiBriefcase className="icon" />
                  <span className="arjun">Manager</span>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item logout-btn"
                  onClick={() => navigate("/")}
                >
                  <FaSignOutAlt className="icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="content-body">
          <Outlet />
          <div className="download-actions"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
