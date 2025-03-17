const express = require('express'); 
const { createArticle, getAllArticles, getArticleBySlug, updateArticle, deleteArticle } = require('../controllers/articleController');
const { authMiddleware, isArticleOwnerOrAdmin, isAdmin } = require("../middlewares/authMiddleware"); 

const router = express.Router();

// Public
router.get("/", getAllArticles);
router.get("/:id", getArticleBySlug);

// Private 
router.post("/", authMiddleware, isAdmin, createArticle); 
router.put("/:id", authMiddleware, isArticleOwnerOrAdmin, updateArticle);
router.delete("/:id", authMiddleware, isArticleOwnerOrAdmin, deleteArticle);

module.exports = router;