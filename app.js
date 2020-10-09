// Dependencies
var express = require("express");
const path = require("path");
require('dotenv').config();
// const htmlRoutes = require("./routes/htmlRoutes")
// sets up express app
const app = express();
var PORT = process.env.PORT || 8081;
// Requiring our models for syncing 
var db = require("./models");
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// templating engine
app.set('view engine', 'ejs');
// ────────────────────────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, "db")));
// ────────────────────────────────────────────────────────────────────────────────
// require("./routes/html-routes.js")(app);
require("./routes/restaurant-api-route.js")(app);
require("./routes/food-api-route.js")(app);
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});