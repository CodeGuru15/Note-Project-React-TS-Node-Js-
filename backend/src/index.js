const express = require("express");
const cors = require("cors");

require("dotenv").config();

const port = process.env.BACKEND_SERVER_PORT;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
      ? process.env.DATABASE_PASSWORD
      : "",
    database: process.env.DATABASE_NAME,
  },
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/register", async (req, res) => {
  const newUser = await req.body;
  // const hashedPassword = await bcrypt.hash(password, 10);
  // const user = { name, email, password: hashedPassword };
  // await knex("users").insert(newUser);
  console.log(newUser);
  res.status(200).json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const loggedUser = await req.body;
  console.log(loggedUser);
  res.status(200).json({ message: "User logged in successfully" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
