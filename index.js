const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const practiceRoute = require("./routes/practiceRoutes");
const practiceJwt = require("./routes/jwtRoutes");
const cors = require("cors");
const bcrypt = require("bcrypt");
const os = require("node:os");

const app = express();
console.log("test", __dirname);
console.log("os", os.cpus().length);

(async () => {
  const hash = await bcrypt.hash("hello", 10);
  console.log("bcrypt", hash);
  let hashed = hash;
  const check = await bcrypt.compare("hello0", hash);
  console.log("check", check);
})();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/user", userRoute);
app.use("/practice", practiceRoute);
app.use("/jwt", practiceJwt);

const port = 5000;

mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
