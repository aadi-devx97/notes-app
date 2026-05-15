const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const verifyToken = require("../middleware/authMiddleware");

const SECRET_KEY = process.env.JWT_SECRET;

//profile route (barely)
router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Welcome to protected route",
        user: req.user
    });
});

//sign up route.
router.post("/signup", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Missing fields"
        })
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        username,
        password: hashedPassword
    });

    res.status(201).json({
        message: "User created successfully"
    });

});

//login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // check empty
    if (!username || !password) {
        return res.status(400).json({
            message: "Missing fields"
        })
    }

    const user = await User.findOne({ username });

    // if not found
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            message: "Wrong password"
        });
    }

    // success
    const token = jwt.sign(
        { username: user.username }, // payload
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        message: "Login successful",
        token
    });
});

module.exports = router;