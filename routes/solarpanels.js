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
  //Find the solar panel in the database according to the given id
  const query = "SELECT * FROM solarpanels WHERE id = ?";

  db.query(query, [id], (err, results) => {
    //Check if he query failed
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Server error");
    }

    //Check if the solar panel was found
    if (results.length === 0) {
      return res.status(401).send("Solar panel not found in the database");
    }

    //Save the current solar panel in the session.
    req.session.panel = {
      status: results[0].Status,
      power: results[0].Power,
      kwh: results[0].KWH,
      length: results[0].Length,
      width: results[0].Width,
    };
    next();
  });
};

// Adding a new solar panel to the DB
router.post("/add", (req, res) => {
  //Get parameters for new point from user
  const { power, kwh, length, width } = req.body;

  //Construct the insert query according to the input parameters
  const insertQuery =
    "INSERT INTO solarpanels (power, kwh, length, width) VALUES (?, ?, ?, ?)";

  //Execute the query
  db.query(insertQuery, [power, kwh, length, width], (err, results) => {
    //Check if the query secceeded.
    if (err || results.length === 0) {
      return res.status(500).send("error adding solar panel: ", err.cause);
    }
    //Query seccedded.
    res.status(201).send("solar panel added!");
  });
});

// Updating a solar panel in the DB according to it's id //Only updates the status to inactive (the other values cannot change.)
router.post("/update/:id", checkIfExist, (req, res) => {
  //Get parameters for new point from user
  const { id } = req.params;

  //Construct the insert query according to the input parameters
  const selectQuery = "SELECT * FROM solarpanels WHERE id = ?";

  //Execute the query
  db.query(selectQuery, [id], (err, results) => {
    //Check if the query succeeded
    if (err) {
      return res.status(500).send("DB error");
    }
    //Since we already used the middlewere. we know that te point exists in the DB.

    //setting the correct values for the query
    const currentPanel = results[0];

    const updateQuery = "UPDATE  solarpanels SET Status = ? WHERE ID = ?";

    return db.query(updateQuery, [!currentPanel.Status, id], (err) => {
      if (err || !results[0]) {
        return res.status(500).send("DB error123");
      }
      res.send("solar panel updated successfully");
    });
  });
});

//Deleting a solar panel from the DB
router.delete("/delete/:id", checkIfExist, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM solarpanels WHERE id=?";
  db.query(query, [id], (err, results) => {
    if (err || !results) {
      return res.status(400).send("DB error. Unable to delete");
    }
    return res.status(200).send("solar panel deleted successfully");
  });
});

module.exports = router;
