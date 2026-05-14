const express = require("express");

const router = express.Router();

const Note = require("../models/Note");

const verifyToken = require("../middleware/authMiddleware");   

//note creation route
router.post("/notes", verifyToken, async (req, res) => {

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
router.get("/notes", verifyToken, async (req, res) => {

    const userNotes = await Note.find({
        username: req.user.username
    });

    res.json(userNotes);
});

//delete note route
router.delete("/notes/:id", verifyToken, async (req, res) => {

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
router.put("/notes/:id", verifyToken, async (req, res) => {

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

module.exports = router;