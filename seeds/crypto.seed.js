const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Crypto } = require("../models/Crypto.js");
const { cryptoSeed } = require("../utils/crypto.utils.js");

console.log(cryptoList);

const cryptoReset = async () => {
  try {
    const database = await connect();
    await cryptoSeed();
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

cryptoReset();
