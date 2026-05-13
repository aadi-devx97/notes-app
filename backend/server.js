require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Note = require("./models/Note");

//creating server here
const app = express();                      
const PORT = process.env.PORT || 3000;      

const SECRET_KEY = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

//middleware to enable cors
app.use(cors({
    origin: "*"  //allow all origin
}));
app.use(express.json());  

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
}



app.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Welcome to protected route",
        user: req.user
    });
});

//test route
app.get("/", (req, res) => {
  res.send("Server is running");    
});

//sign up route.
app.post("/signup", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "Missing fields" });
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        username,
        password: hashedPassword
    });

    res.json({ message: "User created successfully" });

});

//login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // check empty
    if (!username || !password) {
        return res.json({ message: "Missing fields" });
    }

    const user = await User.findOne({ username });

    // if not found
    if (!user) {
        return res.json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.json({ message: "Wrong password" });
    }

    // success
    const token = jwt.sign(
        { username: user.username }, // payload
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token
    });
});

//note creation route
app.post("/notes", verifyToken, async (req, res) => {

    const { title, text } = req.body;

    if (!text) {
        return res.json({ message: "Note text required" });
    }

    const newNote = await Note.create({
        title,
        text,
        username: req.user.username
    });

    res.json({
        message: "Note added successfully",
        note: newNote
    });

});

//get notes route
app.get("/notes", verifyToken, async (req, res) => {

    const userNotes = await Note.find({
        username: req.user.username
    });

    res.json(userNotes);
});

//delete note route
app.delete("/notes/:id", verifyToken, async (req, res) => {

    const noteId = req.params.id;

    const deletedNote = await Note.findOneAndDelete({
        _id: noteId,
        username: req.user.username
    });

    if (!deletedNote) {
        return res.json({
            message: "Note not found"
        });
    }

    res.json({
        message: "Note deleted successfully"
    });

});
// update note route
app.put("/notes/:id", verifyToken, async (req, res) => {

    const noteId = req.params.id;

    const { title, text } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
        {
            _id: noteId,
            username: req.user.username
        },
        {
            title,
            text
        },
        {
            new: true
        }
    );

    if (!updatedNote) {
        return res.json({
            message: "Note not found"
        });
    }

    res.json({
        message: "Note updated successfully",
        note: updatedNote
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})