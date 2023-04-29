// express req (npm i express)
const express = require("express");
// Models
const { Crypto } = require("../models/Crypto.js");
// Routers - book only.
const router = express.Router();
// Utils
const { cryptoSeed } = require("../utils/crypto.utils.js");

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

// Convert to CSV
router.get("/csv", async (req, res) => {
  // How to read query.params
  console.log(req.query);
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cryptos = await Crypto.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Crypto.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cryptos,
    };

    res.send(convertJsonToCsv(response));
  } catch (error) {
    res.status(500).json(error);
  }
});

const convertJsonToCsv = (jsonData) => {
  let csv = "";

  // Encabezados
  const firstItemInJson = jsonData.data[0];
  const headers = Object.keys(firstItemInJson.toObject());
  csv = csv + headers.join(";") + "; \n";

  // Datos

  // Recorremos cada fila
  jsonData.data.forEach((item) => {
    // Dentro de cada fila recorremos todas las propiedades
    headers.forEach((header) => {
      csv = csv + item[header] + ";";
    });
    csv = csv + "\n";
  });

  return csv;
};

// sort by market-cap
router.get("/sorted-by-marketcap", async (req, res) => {
  // How to read query.params
  console.log(req.query);
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const order = req.query.order;
    const cryptos = await Crypto.find()
      .sort({ marketCap: order })
      .limit(limit)
      .skip((page - 1) * limit);
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
// sort by date
router.get("/sorted-by-date", async (req, res) => {
  // How to read query.params
  console.log(req.query);
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const order = req.query.order;
    const cryptos = await Crypto.find()
      .sort({ created_at: order })
      .limit(limit)
      .skip((page - 1) * limit);
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

// get by price-range
router.get("/price-range", async (req, res) => {
  // How to read query.params
  console.log(req.query);
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const min = req.query.min;
    const max = req.query.max;
    const cryptos = await Crypto.find({ price: { $gte: min, $lte: max } })
      .limit(limit)
      .skip((page - 1) * limit);
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

// CRUD: CREATE
router.post("/", async (req, res) => {
  console.log(req.headers);

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
    console.error(error);
    res.status(500).json(error);
  }
});

// RESET CRYPTODB
router.delete("/reset", async (req, res) => {
  try {
    cryptoSeed();
    const cryptoReset = await Crypto.find({ cryptoSeed });
    if (cryptoReset) {
      res.json(cryptoReset);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cryptoDeleted = await Crypto.findByIdAndDelete(id);
    if (cryptoDeleted) {
      res.json(cryptoDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
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

// search functionality: - CRUD: READ
// NOTE - "/:id" - MUST be put below other routes because it acts as an empty box.
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
    console.error(error);
    res.status(500).json(error);
  }
});

// JSDoc
