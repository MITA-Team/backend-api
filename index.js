import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";

// Mongodb model
import Users from "./models/Users.js";

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/dbmita', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Endpoint to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a new user
app.post("/users", async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await Users.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Call connectDB to initiate the server after connecting to the database
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
