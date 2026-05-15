
import React from 'react';
import './AdminDashboard.css';

const UserManagement = () => {
  // Placeholder data
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', orders: 5 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', orders: 2 },
  ];

  return (
    <div>
      <h2 className="dashboard-title">User Management</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.orders}</td>
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
