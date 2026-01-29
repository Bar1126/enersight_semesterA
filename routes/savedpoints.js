const express = require("express");
const router = express.Router();
const db = require("../databases/db");
const session = require("express-session");

//A middleware to check wether the point already exists in the database.
const checkIfExist = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    //id was not provided
    return res.status(400).send("id required");
  }

  //Find the point in the database according to the given id
  const query = "SELECT * FROM savedpoints WHERE id = ?";

  db.query(query, [id], (err, results) => {
    //Check if he query failed
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Server error");
    }

    //Check if the point was found
    if (results.length === 0) {
      return res.status(401).send("Point not found in the database");
    }

    req.session.point = {
      longitude: results[0].Longitude,
      latitude: results[0].Latitude,
      startDate: results[0].StartDate,
      endDate: results[0].EndDate,
      predictedEnergy: results[0].PredictedEnergy,
      predictedElectricity: results[0].PredictedElectricity,
      windVelocity: results[0].WindVelocity,
      uv: results[0].UV_nm,
      isBuildable: results[0].isBuildable,
      timePeriod: results[0].TimePeriod,
      status: results[0].Status,
    };

    next();
  });
};

//**
// Adding a new point to the DB
router.post("/add", (req, res) => {
  //Get parameters for new point from user
  const {
    longitude,
    latitude,
    startDate,
    endDate,
    predictedEnergy,
    predictedElectricity,
    windVelocity,
    uv,
    isBuildable,
    timePeriod,
  } = req.body;

  //Construct the insert query according to the input parameters
  const insertQuery =
    "INSERT INTO savedPoints (longitude, latitude, startDate, endDate, predictedEnergy, predictedElectricity, windVelocity, UV_nm,  isBuildable, timePeriod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  //Execute the query
  db.query(
    insertQuery,
    [longitude, latitude, startDate, endDate, 0, 0, 0, 0, 1, "year"], //hard coded for semester A, will be changed later
    (err, results) => {
      //Check if the query secceeded.
      if (err || results.length === 0) {
        return res.status(500).send(err.message);
      }
      //Query seccedded.
      res.status(201).send("point added!");
    },
  );
});

//**
// Updating a point in the  savedPoints DB according to it's id*/
router.post("/update/:id", checkIfExist, (req, res) => {
  //Get parameters for new point from user
  let {
    longitude,
    latitude,
    startDate,
    endDate,
    predictedEnergy,
    predictedElectricity,
    windVelocity,
    uv,
    isBuildable,
    timePeriod,
  } = req.body;
  const { id } = req.params;

  //Construct the insert query according to the input parameters
  const selectQuery = "SELECT * FROM savedpoints WHERE id = ?";

  //Execute the query
  db.query(selectQuery, [id], (err, results) => {
    //Check if the query succeeded
    if (err) {
      return res.status(500).send("DB error");
    }
    //Since we already used the middlewere. we know that te point exists in the DB.

    //setting the correct values for the query
    const currentPoint = results[0];
    longitude = longitude ? longitude : currentPoint.Longitude;
    latitude = latitude ? latitude : currentPoint.Latitude;
    startDate = startDate ? startDate : currentPoint.StartDate;
    endDate = endDate ? endDate : currentPoint.EndDate;
    predictedEnergy = predictedEnergy
      ? predictedEnergy
      : currentPoint.PredictedEnergy;
    predictedElectricity = predictedElectricity
      ? predictedElectricity
      : currentPoint.PredictedElectricity;
    windVelocity = windVelocity ? windVelocity : currentPoint.WindVelocity;
    uv = uv ? uv : currentPoint.UV_nm;
    isBuildable = isBuildable ? isBuildable : currentPoint.isBuildable;
    timePeriod = timePeriod ? timePeriod : currentPoint.TimePeriod;

    const updateQuery =
      "UPDATE  savedpoints SET Longitude = ?, Latitude = ?, StartDate = ?, EndDate = ?, PredictedEnergy = ?, PredictedElectricity = ?, WindVelocity = ?, UV_nm = ?, IsBuildable = ?, TimePeriod = ? WHERE ID = ?";

    return db.query(
      updateQuery,
      [
        longitude,
        latitude,
        startDate,
        endDate,
        predictedEnergy,
        predictedElectricity,
        windVelocity,
        uv,
        isBuildable,
        timePeriod,
        id,
      ],
      (err) => {
        if (err || !results[0]) {
          console.log("err\n" + err);
          console.log(results[0]);
          return res.status(500).send("DB error123");
        }
        res.send("point updated successfully");
      },
    );
  });
});

router.delete("/delete/:id", checkIfExist, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM savedpoints WHERE id=?";
  db.query(query, [id], (err, results) => {
    if (err || !results) {
      return res.status(400).send("DB error. Unable to delete");
    }
    return res.status(200).send("point deleted successfully");
  });
});

/* GET ALL SAVED POINTS */
router.get("/", (req, res) => {
  const sql = `
    SELECT
      ID as id,
      Longitude as longitude,
      Latitude as latitude,
      StartDate as startDate,
      EndDate as endDate,
      PredictedEnergy as predictedEnergy
    FROM savedpoints
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET POINTS ERROR:", err);

      return res.status(500).json({
        message: "Failed to load points",
      });
    }

    res.json(results);
  });
});

module.exports = router;
