import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import './AdminDashboard.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="dashboard-title">User Management</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>@{user.username || 'user'}</td>
                <td>{user.full_name || 'N/A'}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.role === 'admin' ? 'Admin' : 'User'}</td>
                <td>
                  <button>View Profile</button>
                  <button>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
