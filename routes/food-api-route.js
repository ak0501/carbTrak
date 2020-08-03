var db = require("../models");
const food = require("../models/food");
const request = require("request");
const { response } = require("express");
// const appId = process.env.APP_ID;
// const appKey = process.env.APP_KEY;


/* ----------------------- all food from a restaurant ----------------------- */
module.exports = function (app) {
    app.get("/api/resfood", function (req, res) {
        db.Food.findAll({
                include: [db.Restaurant]
            }).then(function (trackFood) {
                res.json(trackFood);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    /* ------------------------------- Back End server requesting the external API for data ------------------------------ */
    app.get("/api/nutrition/:input/:meal/:restaurant", function (req, res) {
        const userInput = req.params.input;
        // const userMeal = req.params.meals;
        // https://api.edamam.com/api/nutrition-data?app_id=7a57ac67&app_key=8868f05120bf80af87dfd7844e4d4466&ingr=1%20large%20apple
        const queryURL = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}&ingr=${userInput}`;
        var options = {
            'method': 'GET',
            'url': queryURL,
            'headers': {
                'Cookie': 'route=3fb21b3a330e18479587acfee3ee1f11'
            }
        };
        request(options, function (error, response) {
            var responseBody = JSON.parse(response.body);
            if (error) throw new Error(error);
            console.log(responseBody, "responseBody");
            let nutrients = responseBody.totalNutrients;
            console.log(nutrients, "nutrients");
            let carbohydrates = nutrients.CHOCDF.quantity ? nutrients.CHOCDF.quantity : 0;
            console.log(carbohydrates, "carbohydrates");
            let totalFibers = nutrients.FIBTG.quantity ? nutrients.FIBTG.quantity : 0;
            console.log(totalFibers, "totalfibers");

            // const netCarbs = responseBody.totalNutrients ;
            let netCarbs = parseInt((carbohydrates) - (totalFibers)).toFixed(1);
            console.log(netCarbs, "netCarbs");

            // let userMeal = "";

            // var dbItem = {
            //     // add restaurant function
            //     RestaurantId: responseBody.id,
            //     meal: userMeal, //.val()
            //     carbs: nutrients && carbohydrates,
            //     fiber: nutrients && totalFibers,
            //     netCarbs: netCarbs
            // };
        });
    });

    /* ----------------------------- create new Meal ---------------------------- */
    app.post("/api/meals", function (req, res) {

        db.Food.create({
            meal:req.body.name,
        }).then(function () {
                console.log("did we get here");
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.json(err);
            });

    });



    // ───────────────────────────────────Delete Meal 


    app.delete("/api/meals/:id", function (req, res) {
        db.Food.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.json(err);
            });

    });
};