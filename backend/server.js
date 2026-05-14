require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");      

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

//creating server here
const app = express();                      
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

//middleware to enable cors
app.use(cors({
    origin: "*"  //allow all origin
}));

app.use(express.json());  
app.use(authRoutes);
app.use(noteRoutes);

//test route
app.get("/", (req, res) => {
  res.send("Server is running");    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})