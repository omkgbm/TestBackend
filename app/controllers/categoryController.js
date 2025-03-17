const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create (Admin Only)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category = await prisma.category.create({
            data: { name, userId: req.user.id },
        });

        res.status(201).json(category); 
    } catch (error) {
        res.status(500).json({ error: "Failed to create category" });
    }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to get categories" });
    }
};

// Get Category By Id
exports.getCategoryBySlug = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({ where: { id } });
        
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: "Failed to get category" });
    }
};

// Update (Admin Only)
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name } = req.body;

        const category = await prisma.category.update({
            where: { id },
            data: { name },
        });

        res.json(category);
        } catch (error) {
            res.status(500).json({ error: "Failed to update category" });
        }
};

// Delete (Admin Only)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.category.delete({ where: { id }});

        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete category" });
    }
};