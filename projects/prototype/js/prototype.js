//plant stats
// let plantState = sapling;
let plantHealth = 0;
let waterLevel = 0;
let foodLevel = 0;
let lightExposure = 50;
let humidity = 50;

document.getElementById("water").addEventListener("click", function (e) {
    waterPlant();
    console.log(waterLevel);
});
document.getElementById("food").addEventListener("click", function (e) {
    feedPlant();
    console.log(foodLevel);
});

//functions to update plant stats
function waterPlant() {
    waterLevel += 10;
    plantHealth += 5;
}

function feedPlant() {
    foodLevel += 10;
    plantHealth += 5;
}

//interval for progressive plant decay
// setInterval(() => {
//     waterLevel -= 5;
//     foodLevel -= 5;
// });