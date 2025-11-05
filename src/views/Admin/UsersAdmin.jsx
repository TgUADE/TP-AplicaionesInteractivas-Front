import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hook/useAuth";
import { exportUsersToCSV } from "../../lib/utils";

import UsersTab from "../../components/Admin/tabs/UsersTab";

import { getUsers as getUsersService } from "../../services/users";

const UsersAdmin = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await getUsersService(token);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Error cargando usuarios");
    } finally {
      setUsersLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleExport = () => {
    try {
      exportUsersToCSV(users);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <UsersTab users={users} loading={usersLoading} onExport={handleExport} />
  );
};

export default UsersAdmin;
