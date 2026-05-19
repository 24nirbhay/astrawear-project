import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import './AdminDashboard.css';
import { FaChartBar, FaBoxOpen, FaUsers } from 'react-icons/fa';

const DashboardHome = () => {
  const [stats, setStats] = useState({ products: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setStats({
        products: productsCount || 0,
        users: usersCount || 0
      });
    };
    fetchStats();
  }, []);

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
            <p>{stats.products}</p>
          </div>
        </div>
        <div className="widget">
          <div className="widget-icon-container">
            <FaUsers className="widget-icon" />
          </div>
          <div className="widget-info">
            <h3>New Users</h3>
            <p>{stats.users}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
