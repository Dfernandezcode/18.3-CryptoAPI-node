// express req (npm i express)
const express = require("express");
// Models
const { Crypto } = require("../models/Crypto.js");
// Routers - book only.
const router = express.Router();

// Home Route: - CRUD: READ
router.get("/", async (req, res) => {
  // How to read query.params
  console.log(req.query);
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cryptos = await Crypto.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // LIMIT 10, PAGE 1 -> SKIP = 0
    // LIMIT 10, PAGE 2 -> SKIP = 10
    // LIMIT 10, PAGE 3 -> SKIP = 20
    // ...

    // Num total de elementos
    const totalElements = await Crypto.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cryptos,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// search functionality: - CRUD: READ
router.get("/crypto", (req, res) => {
  Crypto.find()
    .then((cryptos) => res.json(cryptos))
    .catch((error) => res.status(500).json(error));
});

// get by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const crypto = await Crypto.findById(id);
    if (crypto) {
      res.json(crypto);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get by Name
router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    // const crypto = await Crypto.find({ name: name });
    const crypto = await Crypto.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (crypto) {
      res.json(crypto);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint Crypto creation: - CRUD: CREATE
router.post("/crypto", async (req, res) => {
  try {
    const crypto = new Crypto({
      name: req.body.name,
      price: req.body.price,
      marketCap: req.body.marketCap,
      created_at: req.body.created_at,
    });

    const createdCrypto = await crypto.save();
    return res.status(201).json(createdCrypto);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Crypto delete: - CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    // returns deleted Crypto
    const id = req.params.id;
    const cryptoDeleted = await Crypto.findByIdAndDelete(id);
    if (cryptoDeleted) {
      res.json(cryptoDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Crypto update: - CRUD: UPDATE
// (req.body) is an object with all info to be updated.
// { new: true } - is a parameter that will return "new updated database entry"
router.put("/:id", async (req, res) => {
  try {
    // returns deleted crypto
    const id = req.params.id;
    const cryptoUpdated = await Crypto.findByIdAndUpdate(id.req.body, { new: true });
    if (cryptoUpdated) {
      res.json(cryptoUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { cryptoRouter: router };
