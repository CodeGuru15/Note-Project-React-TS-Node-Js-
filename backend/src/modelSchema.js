require("dotenv").config();

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
      ? process.env.DATABASE_PASSWORD
      : "",
    database: process.env.DATABASE_NAME,
    // charset: "utf8mb4",
    // collation: "utf8mb4_unicode_ci",
  },
});

knex.schema
  .createTable("users", (user) => {
    user.increments("id").primary();
    user.string("name");
    user.string("dob");
    user.string("email");
  })
  .then(() => {
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error(error);
  });
