const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");

const SubmittedRoutes = require('./routes/SubmittedRouter');
const BookRoutes = require("./routes/BookRouter");

const Book = require("./models/Book");
const Submitted = require("./models/Submitted");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", SubmittedRoutes);
app.use("/api", BookRoutes);

async function initializeDatabase() {
  await sequelize.sync({ force: false });
}
initializeDatabase();

//Todo: Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
