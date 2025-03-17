const jwt = require('jsonwebtoken'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization"); 

    if (!token) return res.status(401).json({ error: "Access denied" });
    
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role !== "Admin") {
            return res.status(403).json({ error: "Only admin can access" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: "Something wrong with the server" });
    }
};

const isArticleOwnerOrAdmin = async (req, res, next) => {
    try {
        const article = await prisma.article.findUnique({ where: { id: req.params.id } });

        if (!article) {
            return res.status(404).json({ error: "Article not found"});
        }

        if (article.userId !== req.user.id && req.user.role !== "Admin") {
            return res.status(403).json({ error: "You're not authorized to access"})
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: "Something wrong with the server" });
    }
};

module.exports =  { authMiddleware, isAdmin, isArticleOwnerOrAdmin };