const express = require("express");
const User = require("../model/user");
const customRouter = express.Router();

customRouter.post("/", async (req, res) => {
  const newData = req.body;
  const data = await User.create(newData);
  return res.status(201).json({ message: "Data INserted Succesfully" });
});

customRouter.get("/", async (req, res) => {
  const data = await User.find();
  return res.status(201).send(data);
});

customRouter.get("/custom", async (req, res) => {
  console.log("query", req.query);
  const { name, age, sortBy } = req.query;
  console.log("age", age);
  // const data = await User.find().select("name age");
  // return res.status(201).send(data);
});

customRouter.delete("/all", async (req, res) => {
  const data = await User.deleteMany({});
  return res.status(201).json({ message: "all data erased" });
});

customRouter.delete("/:id", async (req, res) => {
  const deleteId = req.params.id;
  const data = await User.findByIdAndDelete(deleteId);
  return res.status(201).json({ data });
});

customRouter.put("/:id", async (req, res) => {
  const updateId = req.params.id;
  const newData = req.body;
  const updatedData = await User.findByIdAndUpdate(updateId, newData, {
    new: true,
  });
  return res.status(201).json({ updatedData });
});

customRouter.patch("/:id", async (req, res) => {
  const updateId = req.params.id;
  const newData = req.body;
  const user = await User.findById(updateId);
  const updatedData = await User.findByIdAndUpdate(updateId, newData, {
    new: true,
  });
  return res.status(201).json({ updatedData });
});

customRouter.post("/postMany", async (req, res) => {
  try {
    const newData = req.body;
    await User.insertMany(newData);
    return res.status(201).json({ message: "Added users successfully!" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = customRouter;
