
import React from 'react';
import './AdminDashboard.css';
import { FaChartBar, FaBoxOpen, FaUsers } from 'react-icons/fa';

const DashboardHome = ({ products }) => {
  return (
    <div className="dashboard-home">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-widgets">
        <div className="widget">
          <div className="widget-icon-container">
            <FaChartBar className="widget-icon" />
          </div>
          <div className="widget-info">
            <h3>Total Sales</h3>
            <p>$50,000</p>
          </div>
        </div>
        <div className="widget">
          <div className="widget-icon-container">
            <FaBoxOpen className="widget-icon" />
          </div>
          <div className="widget-info">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
        </div>
        <div className="widget">
          <div className="widget-icon-container">
            <FaUsers className="widget-icon" />
          </div>
          <div className="widget-info">
            <h3>New Users</h3>
            <p>30</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
