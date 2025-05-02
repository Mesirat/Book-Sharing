import { useEffect, useState } from "react";
import axios from "axios";

const  RoleManager=()=> {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setUsers(res.data);
  };

  const updateRole = async (id, newRole) => {
    await axios.put(`/api/admin/users/${id}/role`, { role: newRole }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchUsers(); 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Role Manager</h2>
      {users.map(user => (
        <div key={user._id} className="mb-2 border p-2">
          <p>{user.name} ({user.email}) — <strong>{user.role}</strong></p>
          <select
            value={user.role}
            onChange={e => updateRole(user._id, e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ))}
    </div>
  );
}
export default RoleManager;