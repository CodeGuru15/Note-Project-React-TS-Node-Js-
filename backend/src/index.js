const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();

const port = process.env.BACKEND_SERVER_PORT;

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

// knex.schema
//   .createTable("users", (table) => {
//     table.increments("id").primary();
//     table.string("name");
//     table.string("dob");
//     table.string("email");
//     table.string("token");
//   })
//   .then(() => {
//     console.log("table created successfully!");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

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

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
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
        // await sendOTPEmail(requestedUser.email, otp);
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
      console.log(newUser);
      tempOtp = "";
      res.status(200).json({ success: true, message: "Sign up successfull!" });
    } catch (error) {
      res.status(400).json({ success: false, message: "Registration failed!" });
      console.log(error.message);
    }
  };
  if (tempOtp === userOtp) {
    registration();
    return;
  } else {
    res.json({ message: "OTP doesn't match" });
  }
});

app.post("/login", async (req, res) => {
  const loggedUser = await req.body;
  console.log(loggedUser);
  res
    .status(200)
    .json({ success: true, message: "User logged in successfully" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
