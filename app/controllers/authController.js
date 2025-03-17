const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//Register
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    // Validation
    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User to upload to database
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: role || "User",
            },
        });

        res.status(201).json({ message: "User created", user });
    } catch (error) {
        res.status(500).json({ error: "Something wrong when creating user" });
    }
}; 

//Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Bandingkan password yang diketik dengan yang ada di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Password incorrect" });
        }

        // Buat token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error when login:", error);
        res.status(500).json({ error: "Something wrong when login" });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, role: true, createdAt: true },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Something wrong when get profile" });
    }
}