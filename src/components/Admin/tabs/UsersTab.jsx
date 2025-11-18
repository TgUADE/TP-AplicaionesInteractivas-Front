import Button from "../../UI/Button";

const UsersTab = ({ users, loading, onExport }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-gray-500">List of users for campaigns.</p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onExport}
          className="bg-black text-white rounded-full px-6 h-10"
        >
          Export Excel
        </Button>
      </div>
    </div>

    <div className="bg-white rounded-2xl border">
      {loading ? (
        <div className="p-6">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Surname</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Zip</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{u.name ?? "-"}</td>
                  <td className="px-4 py-3">{u.surname ?? "-"}</td>
                  <td className="px-4 py-3">{u.email ?? "-"}</td>
                  <td className="px-4 py-3">{u.address ?? "-"}</td>
                  <td className="px-4 py-3">{u.city ?? "-"}</td>
                  <td className="px-4 py-3">{u.zip ?? "-"}</td>
                  <td className="px-4 py-3">{u.country ?? "-"}</td>
                  <td className="px-4 py-3">{u.phone ?? "-"}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    No users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default UsersTab;
