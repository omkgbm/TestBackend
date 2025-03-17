const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// Create Article
exports.createArticle = async (req, res) => {
    try {
        const {title, content, categoryId} = req.body;
        
        // Make sure the category exists
        const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!categoryExists) {
            return res.status(404).json({message: 'Category not found'});
        }

        // Make sure only admin can create
        // const article = await prisma.article.findUnique({ where: { id: req.params.id } });
        // if (article.userId !== req.user.id && req.user.role !== "Admin") {
        //     return res.status(403).json({ error: "You're not authorize to create article" });
        // }

        
        const newArticle = await prisma.article.create ({
            data: {
                title, 
                content,
                categoryId, 
                userId: req.user.id,
            },
        });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json ({ error: "Failed to create article" });
    }
};

// Get All Article
exports.getAllArticles = async (req, res) => {
    try {
        const {
            articleId,
            userId,
            title,
            category,
            createdAtStart, 
            createdAtEnd, 
            sortBy, 
            order
        } = req.query;

        // Build filtering conditions 
        let where = {};

        if (articleId) {
            where.id = articleId;
        }
        if (userId) {
            where.userId = userId;
        }
        if (title) {
            where.title = { contains: title, mode: "insensitive" }; 
        }
        if (category) {
            where.category = { name: category };
        }
        if (createdAtStart || createdAtEnd) {
            where.createdAt = {
                gte: createdAtStart ? new Date(createdAtStart) : undefined,
                lte: createdAtEnd ? new Date(createdAtEnd) : undefined,
            };
        }

        // Sorting logic
        let orderBy = {};
        if (sortBy === "title") {
            orderBy.title = order === "desc" ? "desc" : "asc"; // title
        } else if (sortBy === "articleLength") {
            orderBy.content = order === "desc" ? "desc" : "asc"; // content-length
        } else {
            orderBy.createdAt = order === "asc" ? "asc" : "desc" // createdAt
        }

        const articles = await prisma.article.findMany({
            where,
            orderBy,
            include: { 
                user: { select: { username: true } },
                category: { select: { name: true } }
             },
        });

        if (!articles.length) {
            return res.status(404).json({ error: "No articles found" });
        }

        res.json(articles);
    } catch (error) {
        res.status(500).json ({ error: "Failed to get articles" });
    }
};

// Get Article By Slug
exports.getArticleBySlug = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await prisma.article.findUnique({ 
            where: { id }, 
            include: { 
                user: { select: { username: true } }, 
                category: { select: { name: true } }
            }
        });
        
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        res.json(article);
    } catch (error) {
        res.status(500).json({ error: "Failed to get article" });
    }
};

// Update Article
exports.updateArticle = async (req, res) => {
    try {
        const { title, content, categoryId } = req.body;

        // is there any article?
        const article = await prisma.article.findUnique({ where: { id: req.params.id } });
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        // Make sure user has its own article
        if (article.userId !== req.user.id && req.user.role !== "Admin") {
            return res.status(403).json({ error: "You're not authorize to edit this article" });
        }

        // is there a categories?
        if (categoryId) {
            const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
            if (!categoryExists) {
                return res.status(404).json({ error: "Category not found"});
            }
        }

        const updateArticle = await prisma.article.update({
            where: { id: req.params.id },
            data: { title, content, categoryId },
        });

        res.json(updateArticle);
    } catch (error) {
        res.status(500).json({ error: "Failed to update article" });
    }
};

// Delete Article
exports.deleteArticle = async (req, res) => {
    try {
        const article = await prisma.article.findUnique({ where: {id: req.params.id} });

        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        if (article.userId !== req.user.id && req.user.role !== "Admin") {
            return res.status(403).json({ error: "You're not authorize to delete this article" })
        }

        await prisma.article.delete({
            where: { id: req.params.id },
        });

        res.json({ message: "Delete Article Successful" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete article" });
    }
};