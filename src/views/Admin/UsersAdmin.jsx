import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportUsersToCSV } from "../../lib/utils";

import UsersTab from "../../components/Admin/tabs/UsersTab";

import { fetchAdminUsers } from "../../redux/slices/Admin/adminUsersSlice";
import Toast from "../../components/UI/Toast";
import  useToast  from "../../hook/useToast";
const UsersAdmin = () => {
  const dispatch = useDispatch();
  const { toast, showToast, dismissToast } = useToast();

  const { items: users = [], loading: usersLoading = false } =
    useSelector((state) => state.adminUsers) ?? {};

  useEffect(() => {
    dispatch(fetchAdminUsers()).catch((error) => {
      console.error("Error cargando usuarios", error);
      showToast(
        error?.message || "No se pudieron cargar los usuarios.",
        "error"
      );
    });
  }, [dispatch, showToast]);

  const handleExport = () => {
    try {
      exportUsersToCSV(users);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <UsersTab users={users} loading={usersLoading} onExport={handleExport} />
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
};

export default UsersAdmin;
