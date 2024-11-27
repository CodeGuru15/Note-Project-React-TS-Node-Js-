knex.schema
  .createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("dob");
    table.string("email");
    table.string("token");
  })
  .then(() => {
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error(error);
  });

knex.schema
  .createTable("Note_lists", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.string("title", 255).notNullable();
    table.foreign("user_id").references("users.id");
  })
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Error creating table:", error);
  });

knex.schema.alterTable("note_lists", (table) => {
  table
    .foreign("user_id")
    .references("id")
    .inTable("users")
    .then(() => {
      console.log("Foreign key constraint added successfully!");
    })
    .catch((error) => {
      console.error("Error adding foreign key constraint:", error);
    });
});
