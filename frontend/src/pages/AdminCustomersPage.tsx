import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";

type Customer = { id: string; name: string; created_at: string };
type Profile = { id: string; email: string; role: string; customer_id: string };

export const AdminCustomersPage: React.FC = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("customer_admin");
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    const res = await apiFetch("/admin/customers", {}, token);
    setCustomers(res.customers);
  };

  const loadUsers = async (customerId: string) => {
    const res = await apiFetch(`/admin/users/${customerId}`, {}, token);
    setUsers(res.users);
  };

  useEffect(() => {
    if (token) loadCustomers();
  }, [token]);

  const onSelectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    loadUsers(c.id);
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch(
        "/admin/create-customer-and-user",
        {
          method: "POST",
          body: JSON.stringify({
            customer_name: customerName,
            user_email: userEmail,
            user_password: userPassword,
            user_role: userRole
          })
        },
        token
      );
      setCustomerName("");
      setUserEmail("");
      setUserPassword("");
      await loadCustomers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[2fr,3fr] gap-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">Skapa kund + konto</h2>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <form onSubmit={onCreate} className="space-y-3 bg-white p-4 rounded shadow">
          <div className="space-y-1">
            <label className="text-sm">Kundnamn</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Användarens e-post</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Lösenord</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={userPassword}
              onChange={e => setUserPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Roll</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={userRole}
              onChange={e => setUserRole(e.target.value)}
            >
              <option value="admin">admin</option>
              <option value="customer_admin">customer_admin</option>
              <option value="customer_user">customer_user</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="bg-slate-900 text-white px-4 py-2 rounded text-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Skapar..." : "Skapa kund + konto"}
          </button>
        </form>

        <h2 className="text-lg font-semibold mt-8 mb-3">Kunder</h2>
        <div className="bg-white rounded shadow divide-y">
          {customers.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectCustomer(c)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                selectedCustomer?.id === c.id ? "bg-slate-100" : ""
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Användare {selectedCustomer ? `för ${selectedCustomer.name}` : ""}
        </h2>
        <div className="bg-white rounded shadow">
          {users.length === 0 && (
            <p className="text-sm text-slate-500 px-4 py-3">Inga användare.</p>
          )}
          {users.map(u => (
            <div
              key={u.id}
              className="flex items-center justify-between px-4 py-2 border-b last:border-b-0 text-sm"
            >
              <div>
                <div className="font-medium">{u.email}</div>
                <div className="text-xs text-slate-500">
                  {u.role} · {u.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
