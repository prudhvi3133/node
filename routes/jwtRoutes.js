const express = require("express");
const User = require("../model/user");
const jwtRouter = express.Router();
const bcrypt = require("bcrypt");

let users = [];

jwtRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashPass = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), email, password: hashPass };
  users.push(user);
  console.log(users);
  res.status(201).json({ user });
});

jwtRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((item) => item.email === email);
  if (user) {
    res.json({ message: "user has access" });
  }
  if (!user) {
    res.json({ message: "user doesnt have access" });
  }
});

module.exports = jwtRouter;
