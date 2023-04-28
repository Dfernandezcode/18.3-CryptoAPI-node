const express = require("express");
const { cryptoRouter } = require("./routes/crypto.routes.js");
// BBDD connection
const { connect } = require("./db.js");
connect();

// Express router creation:
const PORT = 3000;
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Delegate all /book routes.
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Welcome to our cryptocurrency homepage.");
});

router.get("*", (req, res) => {
  res.status(404).send("Sorry we couldn't find the page requested - (Error 404).");
});

// Using these routes:
// ORDER IS IMPORTANT! - MOST RESTRICTIVE to LEAST.

server.use("/crypto", cryptoRouter);
server.use("/", router);
server.listen(PORT, () => {
  console.log(`Server online using ${PORT}`);
});
