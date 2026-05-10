require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//creating server here
const app = express();                      
const PORT = process.env.PORT || 3000;      

const SECRET_KEY = process.env.JWT_SECRET;

//middleware to enable cors
app.use(cors({
    origin: "*"  //allow all origin
}));
app.use(express.json());  

function getUsers() {
    const filePath = path.join(__dirname, "data", "users.json");
    return JSON.parse(fs.readFileSync(filePath));
}

function saveUsers(users) {
    const filePath = path.join(__dirname, "data", "users.json");
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

function getNotes() {
    const filePath = path.join(__dirname, "data", "notes.json");

    const data = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(data);
}

function saveNotes(notes) {
    const filePath = path.join(__dirname, "data", "notes.json");

    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

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
  res.send("Notes API working");    
});

//sign up route.
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "Missing fields" });
    }

    const users = getUsers();

    const userExists = users.find(u => u.username === username);

    if (userExists) {
        return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now(),
        username,
        password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    res.json({ message: "User created successfully" });
});

//login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // check empty
    if (!username || !password) {
        return res.json({ message: "Missing fields" });
    }

    const users = getUsers();

    // find user
    const user = users.find(u => u.username === username);

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
app.post("/notes", verifyToken, (req, res) => {

    const { title, text } = req.body;

    if (!text) {
        return res.json({ message: "Note text required" });
    }

    const notes = getNotes();

    const newNote = {
        id: Date.now(),
        title: title,
        text: text,
        username: req.user.username,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);

    saveNotes(notes);

    res.json({
        message: "Note added successfully",
        note: newNote
    });
});

//get notes route
app.get("/notes", verifyToken, (req, res) => {

    const notes = getNotes();

    const userNotes = notes.filter(
        note => note.username === req.user.username
    );

    res.json(userNotes);
});

//delete note route
app.delete("/notes/:id", verifyToken, (req, res) => {

    const noteId = Number(req.params.id);

    let notes = getNotes();

    notes = notes.filter(note => {
        return !(
            note.id === noteId &&
            note.username === req.user.username
        );
    });

    saveNotes(notes);

    res.json({
        message: "Note deleted successfully"
    });

});

// update note route
app.put("/notes/:id", verifyToken, (req, res) => {

    const noteId = Number(req.params.id);

    const { text } = req.body;

    const notes = getNotes();

    const noteIndex = notes.findIndex(
        note =>
            note.id === noteId &&
            note.username === req.user.username
    );

    if (noteIndex === -1) {
        return res.json({
            message: "Note not found"
        });
    }

    notes[noteIndex].text = text;

    saveNotes(notes);

    res.json({
        message: "Note updated successfully"
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})