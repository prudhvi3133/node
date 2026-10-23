const express = require("express");
const User = require("../model/user");
const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------------
// CREATE Operations
// ➕ Create one user

router.post("/", async (req, res) => {
  try {
    //const { name, age, email } = req.body;
    const newUser = await User.create(req.body);
    res.status(201).json({ newUser: newUser });
  } catch (err) {
    res.status(400).json({ message: "Creation failed", error: err.message });
  }
});

// ➕ Create multiple users
router.post("/bulk", async (req, res) => {
  const bulkData = req.body;
  if (!Array.isArray(bulkData)) {
    return res.status(400).json({ message: "Provided data must be an array" });
  }
  try {
    const insertedData = await User.insertMany(bulkData);
    res.status(201).json({ insertedData });
  } catch (err) {
    res.status(400).json({ message: "Bulk insert failed", error: err.message });
  }
});

//----------------------------------------------------------------------------------------------------------------------------
// READ Operations

// 📥 Get all users
router.get("/", async (req, res) => {
  try {
    const entireData = await User.find();
    res.status(200).json({ data: entireData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
});

// 🔍 Search users by query params (e.g. /searchQuery?age=25&name=John)
router.get("/searchQuery", async (req, res) => {
  try {
    const filters = req.query;
    const data = await User.find(filters);
    res.status(200).json({ data });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error finding users", error: err.message });
  }
});

// 🔍 Get users by age using param (e.g. /search/25)
router.get("/search/:age", async (req, res) => {
  try {
    const age = req.params.age;
    const data = await User.find({ age });
    res.status(200).json({ data });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error finding users", error: err.message });
  }
});

// 🧑 Get first user by name (e.g. /first/John)
router.get("/first/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: "Error finding user", error: err.message });
  }
});

// 🆔 Get user by ID (must be placed after specific routes)
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });
  }
});

//----------------------------------------------------------------------------------------------------------------------------
// UPDATE Operations

// ✏️ Bulk update using filter (PUT with query, e.g. ?age=25)
//either we can use updateOne to update first matching object or updateMany for all matching objects
router.put("/updateMany", async (req, res) => {
  try {
    const filter = req.query;
    const updateData = req.body;
    const result = await User.updateMany(filter, updateData);
    res.status(200).json({
      message: `${result.modifiedCount} user(s) updated`,
      result,
    });
  } catch (err) {
    res.status(500).json({ message: "Bulk update failed", error: err.message });
  }
});

// ✏️ Update a single user by ID (PUT = full update)
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

//---------------------------------------------------------------------------------------------------------------------------------
//patch which is used to update specific values in an object

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const updateFields = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateFields);
    res.status(200).json({ updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

//updateMany
router.patch("/updateMany", async (req, res) => {
  const filter = req.query; // Filter to apply to find multiple documents
  const updateFields = req.body; // Fields to update

  try {
    const updatedUsers = await User.updateMany(
      filter, // Filter to select multiple users
      { $set: updateFields }, // $set to update the fields passed in the body
    );

    if (updatedUsers.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No users found to update or no changes made" });
    }

    res.status(200).json({ updatedUsers });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

//-----------------------------------------------------------------------------------------------------------------------
//DELETE
//Delete using findByIdAndDelete
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(400).json({ message: "Deletion failed", error: err.message });
  }
});

//Delete using deleteMany alterantively we can use deleteOne for first matchng
router.delete("/deleteMany", async (req, res) => {
  const filter = req.query;

  try {
    const result = await User.deleteMany(filter);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No users found to delete" });
    }

    res.status(200).json({ message: "Users deleted", result });
  } catch (err) {
    res.status(400).json({ message: "Deletion failed", error: err.message });
  }
});

module.exports = router;
