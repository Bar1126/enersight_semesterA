const express = require("express");
const router = express.Router();
const db = require("../databases/db");
const session = require("express-session");

//A middleware to check wether the solar panel already exists in the database.
const checkIfExist = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    //id was not provided
    return res.status(400).send("id required");
  }
  //Find the wind turbine in the database according to the given id
  const query = "SELECT * FROM windturbines WHERE id = ?";

  db.query(query, [id], (err, results) => {
    //Check if he query failed
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Server error");
    }

    //Check if the wind turbine was found
    if (results.length === 0) {
      return res.status(401).send("windturbines not found in the database");
    }

    //Save the current wind turbine in the session.
    req.session.panel = {
      status: results[0].Status,
      power: results[0].Power,
      kwh: results[0].KWH,
      height: results[0].Height,
    };

    next();
  });
};

// Adding a new wind turbine to the DB
router.post("/add", (req, res) => {
  //Get parameters for new point from user
  const { power, kwh, height } = req.body;
  console.log("power, kwh, height: ", power, kwh, height);

  //Construct the insert query according to the input parameters
  const insertQuery =
    "INSERT INTO windturbines (power, kwh, height) VALUES (?, ?, ?)";

  //Execute the query
  db.query(insertQuery, [power, kwh, height], (err, results) => {
    //Check if the query secceeded.
    console.log("query results: ", results, "err: ", err)
    if (err || results.length === 0) {
      return res.status(500).send("error adding wind turbine: ", err.cause);
    }
    //Query seccedded.
    res.status(201).send("wind turbine added!");
  });
});

// Updating a wind turbine in the DB according to it's id //Only updates the status to inactive (the other values cannot change.)
router.post("/update/:id", checkIfExist, (req, res) => {
  //Get parameters for new point from user
  const { id } = req.params;

  //Construct the insert query according to the input parameters
  const selectQuery = "SELECT * FROM windturbines WHERE id = ?";

  //Execute the query
  db.query(selectQuery, [id], (err, results) => {
    //Check if the query succeeded
    if (err) {
      return res.status(500).send("DB error");
    }
    //Since we already used the middlewere. we know that te point exists in the DB.

    //setting the correct values for the query
    const currentPanel = results[0];

    const updateQuery = "UPDATE  windturbines SET Status = ? WHERE ID = ?";

    return db.query(updateQuery, [!currentPanel.Status, id], (err) => {
      if (err || !results[0]) {
        return res.status(500).send("DB error123");
      }
      res.send("wind turbinel updated successfully");
    });
  });
});

//Deleting a wind turbine from the DB
router.delete("/delete/:id", checkIfExist, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM windturbines WHERE id=?";
  db.query(query, [id], (err, results) => {
    if (err || !results) {
      return res.status(400).send("DB error. Unable to delete");
    }
    return res.status(200).send("wind turbine deleted successfully");
  });
});

//Get all wind turbines from the DB
router.get("/", (req, res) => {
  const query = "SELECT * FROM windturbines";
  db.query(query, (err, results) => {
    if (err || !results) {
      return res.status(400).send("DB error. Unable to get all");
    }
    res.json(results);
  });
});

module.exports = router;
