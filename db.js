// load enviroment variables:
require("dotenv").config();
const DB_CONNECTION = process.env.DB_URL;

// use mongoose ODM to connect.
// install using: npm install mongoose --save

// getting-started.js (MONGOOSE)
const mongoose = require("mongoose");

/* async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    // async await can block code because functions after won't execute until after await function is done
 */

// Connection config:
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: "Cryptocurrencies",
};

const connect = async () => {
  const database = await mongoose.connect(DB_CONNECTION, config);
  const name = database.connection.name;
  const host = database.connection.name;
  console.log(`Connected to ${host} database of ${name}`);
};

// export "connect" function to be used elsewhere.
module.exports = { connect };
