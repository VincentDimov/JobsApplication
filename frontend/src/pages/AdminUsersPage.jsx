import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUsersByCustomer, updateUserRole, deleteUser } from "../api/admin";

const AdminUsersPage = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await getUsersByCustomer(id);
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, [id]);

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    fetchUsers();
  };

  return (
    <section className="admin-page">
      <h1>Admin – Användare för kund {id}</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email} – roll:{" "}
            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u.id, e.target.value)}
            >
              <option value="admin">admin</option>
              <option value="customer_admin">customer_admin</option>
              <option value="customer_user">customer_user</option>
            </select>
            <button onClick={() => handleDelete(u.id)}>Ta bort</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminUsersPage;
