import api from "./client";

export const getAllCustomers = () => api.get("/admin/customers");

export const getUsersByCustomer = (customerId) =>
  api.get(`/admin/users/${customerId}`);

export const createCustomerAndUser = (payload) =>
  api.post("/admin/create-customer-and-user", payload);

export const updateCustomerName = (customerId, new_name) =>
  api.put(`/admin/customers/${customerId}`, { new_name });

export const updateUserRole = (userId, new_role) =>
  api.put(`/admin/users/${userId}/role`, { new_role });

export const deleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`);
