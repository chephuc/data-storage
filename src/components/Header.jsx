import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [activeTab, setActiveTab] = useState("Home");
  return (
    <div className="header">
      <h2 className="logo">Phuc App</h2>
      <div className="header-right">
        <Link to="/">
          <p
            className={`${activeTab === "Home" ? "active" : ""}`}
            onClick={() => setActiveTab("Home")}
          >
            Home
          </p>
        </Link>
        <Link to="/add">
          <p
            className={`${activeTab === "Add" ? "active" : ""}`}
            onClick={() => setActiveTab("Add")}
          >
            Add
          </p>
        </Link>
        <Link to="/about">
          <p
            className={`${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
