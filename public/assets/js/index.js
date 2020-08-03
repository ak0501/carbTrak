const $restaurant = $("#newRestaurant");
const $meal = $("#mealInput");
const $calculateBtn = $("#calculateBtn");
const $createBtn = $(".createRestaurant");
const $table = $(".table");
var $Field1 = $(".dropdown");

/* ----------------------------- OnClick Action ----------------------------- */

$(function () {
  $calculateBtn.hide();
  $table.hide();
  $createBtn.hide();
  $('#foodInput, #mySelect, #mealInput, #newRestaurant').change(function () {
    console.log($('#mySelect option:selected').val());
    if ($restaurant.val()) {
      $createBtn.show();
    } else if ($('#foodInput').val() && $('#mySelect option:selected').val() && $('#mealInput').val()) {
      $("#calculateBtn,#nutrition").show("slow");

    } else {
      $("#calculateBtn,#nutrition").hide("fast");
      $createBtn.hide();
    }
  });
});
// ──────────────────────────Create New Restaurant────────────────────────────────────────────────────
$(".createRestaurant").on("click", function () {
  var restaurantName = $("#newRestaurant").val();
  console.log("click here");
  return $.ajax({
    url: "/api/restaurant",
    data: {
      name: restaurantName
    },
    method: "POST",
  }).then((response) => {
    console.log(response);
    location.reload();
  });
});
// ────────────────────────────────────────────────────────────────────────────────
// ─────────────────────────Create New Meal───────────────────────────────────────────────────────
var createMeal = () => {
  var mealName = $('#mealInput').val();
  return $.ajax({
    ulr: "/api/meals",
    data: {
      name: mealName
    },
      method: "POST"
    }).then((response) => {
      console.log(response);
      // location.reload();
    });
  };


createMeal();
// ─────────────────────────Get Restaurant Names───────────────────────────────────────────────────────

const getRestaurant = () => {
  return $.ajax({
      url: "/api/restaurant",
      method: "GET",
    })
    .then((response) => {
      $(document).ready(function () {
        var x, txt = "";
        var restaurantName = response;
        // for loop usually for object
        for (x in restaurantName) {
          txt += restaurantName[x] + " ";
        }
        var selectElem = $("#mySelect");
        // .each is only for array
        $.each(restaurantName, function (index, value) {
          $("<option/>", {
              id: index,
              text: value.name
            })
            .appendTo(selectElem);
        });
      });
      // ─────────────────────────────────────────────────────────────────

      // ───────────────────────────────Get Food Name─────────────────────────────────────────────────

      const getResFood = () => {
        return $.ajax({
          url: "/api/resfood",
          method: "GET",
          data: {}
        });
      };

      getResFood();

    });

};


// ────────────────────────────────────────────────────────────────────────────────

$calculateBtn.on("click", function () {

  var nutrition = $("#foodInput").val();
  var meal = $("#mealInput").val();

  return $.ajax({
      url: "/api/nutrition/" + nutrition + "/" + meal,
      method: "GET",
    })
    // When API call comes back from the backend 
    .then((api_nutrition) => {
      let $tr = $("<tr>");
      let $tdQty = $("<td>");
      // let $tdUnit=$("<td>");
      // let $tdFood=$("<td>");
      let $tdCarbs = $("<td>");
      let $tdFiber = $("<td>");
      let $tdNetCarbs = $("<td>");
      $tdQty.text((api_nutrition.totalWeight).toFixed(1));
      $tr.append($tdQty);
      $("tbody").append($tr);
      // ─────────────────────────────────────────────────────────────────
      let totalCarbs = (api_nutrition.totalNutrients.CHOCDF.quantity).toFixed(1);
      $tdCarbs.text(totalCarbs);
      $tr.append($tdCarbs);
      $("tbody").append($tr);
      // ─────────────────────────────────────────────────────────────────

      let totalFiber = (api_nutrition.totalNutrients.FIBTG.quantity).toFixed(1);
      $tdFiber.text(totalFiber);
      $tr.append($tdFiber);
      $("tbody").append($tr);
      // ────────────────────────────────────────────────────────────────────────────────
      let netCarbs = (totalCarbs - totalFiber);
      console.log(netCarbs);
      $tdNetCarbs.text(netCarbs);
      $tr.append($tdNetCarbs);
      $("tbody").append($tr);

    });

});





getRestaurant();