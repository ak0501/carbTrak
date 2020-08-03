var db = require("../models");
const restaurant = require("../models/restaurant");

// ────────────────────────────────────────────── GET ALL RESTAURANTS FROM DB ─────
module.exports = function (app) {
  app.get("/api/restaurant", function (req, res) {
    db.Restaurant.findAll({}).then(function (results) {
        res.json(results);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
  /* -------------------------- create new restaurant ------------------------- */
  app.post("/api/restaurant", function (req, res) {
    console.log(req.body.name);
    db.Restaurant.create({
        name: req.body.name
      }).then(function (response) {
        console.log(response);
        res.sendStatus(201);
       
      })
      .catch(function (err) {
        console.log(err);
        res.send(401);
      });
  });
};