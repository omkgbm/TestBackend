require('dotenv').config();

const express =  require ( 'express' ); 
const chalk = require('chalk');
const app = express(); 
const port = 3000 ; 
const authRoutes = require("./routes/authRoutes");

const categoryRoutes = require("./routes/categoryRoutes");
const articleRoutes = require("./routes/articleRoutes");

// Database Interaction
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Middleware untuk parsing JSON 
app.use(express.json()); 

// Trial
app.get("/", (req, res) => {
    res.send("Hello, Express.js!, Selamat datang di server!")
});

// Endpoint
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany(); 
    res.json(users);
});

app.use("/api/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/articles", articleRoutes);

// Server Running
app.listen(port, async () => {
    console.log(`Server berjalan pada http://localhost:${port}`)
    console.log(``);
    console.log(`=====================================================================`);
    

// CATEGORY

    // GET
    console.log(chalk.bold.green(`GET AllCategory`));
    console.log(`http://localhost:${port}/categories`);
    console.log(``)

    // GET ID
    console.log(chalk.bold.green(`GET CategoryById`));
    const categories = await prisma.category.findMany(); 
    const categoryUrlsGet = categories.map(cat => `http://localhost:${port}/categories/${cat.id}`).join("\n");

    console.log(categoryUrlsGet); 

    // POST 
    console.log(``)
    console.log(chalk.bold.yellow(`POST Category`)); 
    console.log(`http://localhost:${port}/categories`) 

    // PUT
    console.log(``)
    console.log(chalk.bold.blue(`PUT CategoryById`)); 
    const categoryUrlsPut = categories.map(cat => `http://localhost:${port}/categories/${cat.id}`).join("\n");

    console.log(categoryUrlsPut);

    // DELETE
    console.log(``)
    console.log(chalk.bold.red(`DELETE Category`)); 
    const categoryUrlsDel = categories.map(cat => `http://localhost:${port}/categories/${cat.id}`).join("\n");

    console.log(categoryUrlsDel);


    console.log(``);
    console.log(`=====================================================================`);


// ARTICLE 

    // GET
    console.log(chalk.bold.green(`GET AllArticles`));
    console.log(`http://localhost:${port}/articles`);
    console.log(``)

    // GET ID
    console.log(chalk.bold.green(`GET ArticleById`));
    const articles = await prisma.article.findMany(); 

    const articleUrls = articles.map(cat => `http://localhost:${port}/articles/${cat.id}`).join("\n");

    console.log(articleUrls);

    // POST 
    console.log(``)
    console.log(chalk.bold.yellow(`POST Article`)); 
    console.log(`http://localhost:${port}/articles`) 

    // PUT
    console.log(``)
    console.log(chalk.bold.blue(`PUT ArticleById`)); 
    const articleUrlsPut = articles.map(cat => `http://localhost:${port}/articles/${cat.id}`).join("\n");

    console.log(articleUrlsPut);

    // DELETE
    console.log(``)
    console.log(chalk.bold.red(`DELETE Article`)); 
    const articleUrlsDel = articles.map(cat => `http://localhost:${port}/articles/${cat.id}`).join("\n");

    console.log(articleUrlsDel);


    console.log(``);
    console.log(`=====================================================================`);
    
});