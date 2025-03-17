const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryBySlug, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Create (Admin Only)
router.post("/", authMiddleware, isAdmin, createCategory);

// Read (All Role)
router.get("/", getAllCategories);
router.get("/:id", getCategoryBySlug);

// Update (Admin Only)
router.put("/:id", authMiddleware, isAdmin, updateCategory);

// Delete (Admin Only)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;