window.onload = function () {

    //variables variables variables
    let plantState = "alive";
    let plantHealth = 50;
    let lightExposure = 50;
    let lightDecayActive = false;
    let lightDecayInterval;
    let decayTimeout;
    let decayInterval;
    let deadTimeout;

    const healthIncrease = 5;
    const healthDecrease = 5;
    const range = { from: 50, to: 70 };

    //automaticallyload storagee upon opening
    loadStorage();

    //instructions stuff
    let instructionsBox = document.getElementById("instructionsbox");

    let openInstructions = document.getElementById("instructions");
    openInstructions.addEventListener("click", function (e) {
        instructionsBox.style.display = "flex";
        console.log("instructions!");

        // pause any potential decay
        clearTimeout(decayTimeout);
        stopDecay();
    });

    let closeInstructions = document.getElementById("exitinstructions");
    closeInstructions.addEventListener("click", function (e) {
        instructionsBox.style.display = "none";
        console.log("exit instructions!");

        // resume game
        resetDecayTimer();
    });


    //water, food and light functions
    document.getElementById("water").addEventListener("click", waterPlant);

    function waterPlant() {
        updateHealth();
        resetDecayTimer(); //this timer waits 10 seconds and starts decay if no action is taken!
        saveStorage(); //save storage after any interaction!
    }

    document.getElementById("food").addEventListener("click", feedPlant);

    function feedPlant() {
        updateHealth();
        resetDecayTimer();
        saveStorage();
    }

    document.getElementById("lightslider").addEventListener("input", updateLight);

    function updateLight(event) {
        lightExposure = parseInt(event.target.value); //takes input makes it into a numberrr
        checkLight();
        saveStorage();
    }

    //light stuff
    function checkLight() {
        const lightInRange = lightExposure >= range.from && lightExposure <= range.to;

        if (!lightInRange && !lightDecayActive) {
            console.log("light exposure sucks, decay time");
            lightDecayActive = true;
            startLightDecay();
        } else if (lightInRange && lightDecayActive) {
            console.log("light exposure perfect!");
            lightDecayActive = false;
            stopLightDecay();
        }

        saveStorage();
    }

    function startLightDecay() {
        console.log("starting light decay");

        lightDecayInterval = setInterval(() => {
            plantHealth = Math.max(0, plantHealth - healthDecrease);
            console.log("health decreasing...", plantHealth);

            updateHealthBar();
            checkPlantStatus();
            checkLight();

        }, 3000); //decays every 3? seconds
    }

    function stopLightDecay() {
        if (lightDecayInterval) {
            clearInterval(lightDecayInterval);
            lightDecayInterval = null;
        }
    }

    //update health
    function updateHealth() {
        plantHealth = Math.min(100, plantHealth + healthIncrease);

        if (plantHealth > range.to) {
            plantHealth = Math.max(0, plantHealth - 10); //its gotta be 10, 5 will get it caught in loop w health increase and change NOTHING
            console.log("too much water/food! you're pretty bad at this :(");
        }

        updateHealthBar();
        checkPlantStatus();
        saveStorage();
    }

    //decay interval stuff
    function startDecay() {
        console.log("child neglect is a criminal offense");

        decayInterval = setInterval(() => {
            plantHealth = Math.max(0, plantHealth - healthDecrease);
            console.log("health decreasing...", plantHealth);

            updateHealthBar();
            checkPlantStatus();

        }, 5000); //decays every 5 seconds
    }

    function stopDecay() {
        if (decayInterval) {
            console.log("stopping decay");
            clearInterval(decayInterval);
            decayInterval = null;
        }
    }

    //timer that waits 10 seconds to start decay, used class notes and stack overflow to figure out logic!
    function resetDecayTimer() {
        clearTimeout(decayTimeout);
        stopDecay(); // stop decay immediately when an action is taken

        console.log("reset decay timer");
        decayTimeout = setTimeout(startDecay, 10000); //unless it's reset by an action, decay will start in 10 secs
    }

    //check  if plant died
    function checkPlantStatus() {
        if (plantHealth <= 0 && plantState !== "dead") {
            plantState = "dead";
            document.getElementById("planthealthy").style.display = "none";
            document.getElementById("plantdead").style.display = "block";
            console.log("plant died! This is particularly sad because the plant was sentient with its own thoughts and opinions.");
            stopDecay();
            deadTimeout = setTimeout(deadMessage, 3000); //let player grieve for 3 seconds
        }
    }

    function deadMessage() {
        document.getElementById("deadmessage").style.display = "flex";
        resetGame();
    }

    //reset!
    function resetGame() {
        document.getElementById("resetbutton").addEventListener("click", function () {

            plantHealth = 50;
            lightExposure = 50;

            plantState = "alive";
            document.getElementById("planthealthy").style.display = "block";
            document.getElementById("plantdead").style.display = "none";
            document.getElementById("deadmessage").style.display = "none";

            updateHealthBar();
            resetDecayTimer();
            console.log("game reset");

        });
    }

    //update health bar visually
    function updateHealthBar() {
        document.getElementById("health").style.height = `${plantHealth}px`;
        healthBarColour();
    }

    //health bar colour indication! wonderful idea mathilde
    function healthBarColour() {
        if (plantHealth >= range.from && plantHealth <= range.to) {
            document.getElementById("health").style.background = "green";
        } else if (plantHealth >= 20 && plantHealth < range.from) {
            document.getElementById("health").style.background = "rgb(250, 230, 119)";
        } else {
            document.getElementById("health").style.background = "red";
        }

    }

    //storage stuff, in class notes were too confusing so I used stack overflow and LogRocket Blog
    function saveStorage() {
        let save = {
            plantHealth, lightExposure, plantState
        };
        localStorage.setItem("plantStorageState", JSON.stringify(save));
    }

    function loadStorage() {
        let savedGame = localStorage.getItem("plantStorageState");
        if (savedGame) {
            let savedState = JSON.parse(savedGame);
            plantHealth = savedState.plantHealth;
            lightExposure = savedState.lightExposure;
            plantState = savedState.plantState;

            document.getElementById("lightslider").value = lightExposure;

            updateHealthBar();
            checkLight();

            if (plantHealth <= 0 && plantState === "dead") {
                document.getElementById("planthealthy").style.display = "none";
                document.getElementById("plantdead").style.display = "block";
                document.getElementById("deadmessage").style.display = "flex";
                deadTimeout = setTimeout(deadMessage, 3000); //let player grieve for 3 seconds
            }
        }
    }

    resetDecayTimer(); // start the decay timer on load
}
