const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const port = process.env.BACKEND_SERVER_PORT;
const secret = process.env.JWT_KEY;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

let tempOtp = "";

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

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `Arijit Pal <${process.env.EMAIL_ADDRESS}>`,
    to: toEmail,
    subject: "Your OTP for Verification",
    text: `Your OTP is: ${otp}`,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(info.response);
};

const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

const verifyToken = async (token) => {
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/getuser", async (req, res) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const authToken = authHeader.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ message: "Access denied" });
    }
    try {
      const decoded = await verifyToken(authToken);
      // console.log(decoded);
      res
        .status(200)
        .json({ success: true, message: "Authorized", user: decoded });
    } catch (err) {
      console.error(err);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
});

app.post("/otprequest", async (req, res) => {
  const requestedUser = await req.body;
  const { customAlphabet } = await import("nanoid");
  knex("users")
    .where("email", requestedUser.email)
    .then((users) => {
      if (users.length > 0) {
        res.status(200).json({
          success: false,
          message: "Account already exists",
        });
        return;
      } else {
        const nanoid = customAlphabet("1234567890", 10);
        const otp = nanoid(4);
        sendOTPEmail(requestedUser.email, otp);
        console.log("OTP", otp);
        tempOtp = otp;
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully!" });
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/signinotp", async (req, res) => {
  const requestedUser = await req.body;
  const { customAlphabet } = await import("nanoid");
  knex("users")
    .where("email", requestedUser.email)
    .then((users) => {
      if (users.length > 0) {
        const nanoid = customAlphabet("1234567890", 10);
        const otp = nanoid(4);
        sendOTPEmail(requestedUser.email, otp);
        console.log("OTP", otp);
        tempOtp = otp;
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully!" });
      } else {
        res.status(200).json({
          success: false,
          message: "No such account found",
        });
        return;
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/login/:loginOtp", async (req, res) => {
  const loginOtp = req.params.loginOtp;
  const signInUser = await req.body;
  const handleLogin = async () => {
    knex("users")
      .where("email", signInUser.email)
      .then((users) => {
        if (users.length > 0) {
          tempOtp = "";
          const accessToken = generateAccessToken(users[0]);
          // console.log(accessToken);
          res.status(200).json({
            success: true,
            message: "Login successfull!",
            accessToken,
          });
        }
      })
      .catch((error) => {
        res.status(400).json({ success: false, message: "Login failed!" });
        console.log(error.message);
      });
  };
  if (tempOtp === loginOtp) {
    handleLogin();
  } else {
    res.status(200).json({ success: false, message: "Wrong OTP!" });
  }
});

app.post("/register/:otp", async (req, res) => {
  const userOtp = req.params.otp;
  console.log("user otp", userOtp);

  const newUser = await req.body;
  const registration = async () => {
    try {
      const { nanoid } = await import("nanoid");
      const userToken = nanoid(10);
      newUser.token = userToken;
      await knex("users").insert(newUser);
      // console.log(newUser);
      const accessToken = jwt.sign(newUser, secret, { expiresIn: "1h" });
      tempOtp = "";
      res
        .status(200)
        .json({ success: true, message: "Sign up successfull!", accessToken });
    } catch (error) {
      res.status(400).json({ success: false, message: "Registration failed!" });
      console.log(error.message);
    }
  };
  if (tempOtp === userOtp) {
    registration();
    return;
  } else {
    res.json({ message: "Incorrect OTP" });
  }
});

app.post("/addnote", async (req, res) => {
  const authHeader = req.header("Authorization");
  const newNote = req.body;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const authToken = authHeader.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ message: "Access denied" });
    }
    try {
      const decoded = await verifyToken(authToken);
      if (decoded) {
        // console.log(newNote);
        await knex("note_lists").insert(newNote);
        res
          .status(200)
          .json({ success: true, message: "Note Created Successfully" });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Something Went Wrong" });
      }
    } catch (err) {
      console.error(err);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
});

app.post("/getNotes", async (req, res) => {
  const authHeader = req.header("Authorization");
  const userId = await req.body.id;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const authToken = authHeader.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ message: "Access denied" });
    }
    try {
      const decoded = await verifyToken(authToken);
      // console.log(decoded);
      if (decoded) {
        let userNotes = [];
        const allNotes = async () => {
          await knex("note_lists")
            .where("user_id", userId)
            .then((notes) => (userNotes = notes));
          res.status(200).json({ success: true, userNotes });
        };
        allNotes();
      }
    } catch (err) {
      console.error(err);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
});

app.post("/deletenote", async (req, res) => {
  const authHeader = req.header("Authorization");
  const noteId = await req.body.id;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const authToken = authHeader.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ message: "Access denied" });
    }
    try {
      const decoded = await verifyToken(authToken);
      if (decoded) {
        // console.log(noteId);

        const deleteNote = async () => {
          await knex("note_lists")
            .where("id", noteId)
            .delete()
            .then(() => {
              res
                .status(200)
                .json({ success: true, message: "Note deleted successfully" });
            })
            .catch((error) => {
              console.error("Error deleting note:", error);
            });
        };
        deleteNote();
      }
    } catch (err) {
      console.error(err);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
