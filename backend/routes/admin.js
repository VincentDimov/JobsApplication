import express from "express";
import { createCustomerAndUser, getAllCustomers, getUsersByCustomer, updateUserRole, updateCustomerName, deleteUser } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-customer-and-user", authMiddleware, createCustomerAndUser);
router.get("/customers", authMiddleware, getAllCustomers);
router.get("/admin/customers", authMiddleware, getAllCustomers);
router.get("/users/:customer_id", authMiddleware, getUsersByCustomer);
router.put("/users/:user_id/role", authMiddleware, updateUserRole);
router.put("/customers/:customer_id", authMiddleware, updateCustomerName);
router.delete("/users/:user_id", authMiddleware, deleteUser);

export default router;
