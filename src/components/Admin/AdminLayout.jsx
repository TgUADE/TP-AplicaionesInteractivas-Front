import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";

const AdminLayout = () => (
  <div className="min-h-screen flex bg-white">
    <AdminSidebar />
    <main className="flex-1 p-8">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
