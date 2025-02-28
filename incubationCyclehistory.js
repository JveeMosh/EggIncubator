import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcsd36TvudVQt5kVfBAUGMViND0cbq7Hg",
  authDomain: "egg-incubator-capstone.firebaseapp.com",
  databaseURL: "https://egg-incubator-capstone-default-rtdb.firebaseio.com",
  projectId: "egg-incubator-capstone",
  storageBucket: "egg-incubator-capstone.appspot.com",
  messagingSenderId: "174282783906",
  appId: "1:174282783906:web:f954598da5e4cae31f6bfb",
  measurementId: "G-465R1W5W88",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("Firebase initialized:", app);

// Function to load the current incubation cycle
function loadCurrentCycle() {
  const currentCycleRef = ref(database, "/incubation_cycles/currentCycleNumber");

  onValue(currentCycleRef, (snapshot) => {
    const cycleNumber = snapshot.val();
    if (cycleNumber) {
      const cyclePath = `incubationcycle_${String(cycleNumber).padStart(2, "0")}`;
      console.log("Current Incubation Cycle:", cyclePath);
      loadDays(cyclePath);
    }
  });
}

// Function to load the days dynamically
function loadDays(cyclePath) {
  const daysRef = ref(database, `/incubation_cycles/${cyclePath}/history/`);

  onValue(daysRef, (snapshot) => {
    const daysContainer = document.getElementById("daysContainer");
    daysContainer.innerHTML = ""; // Clear previous days
    const data = snapshot.val();

    if (data) {
      Object.keys(data).forEach((day) => {
        const dayButton = document.createElement("button");
        dayButton.textContent = day;
        dayButton.classList.add("day-button");
        dayButton.addEventListener("click", () => loadTemperatureHumidity(cyclePath, day));
        daysContainer.appendChild(dayButton);
      });
    }
  });
}

// Function to load temperature and humidity for the selected day
function loadTemperatureHumidity(cyclePath, day) {
  const temperatureRef = ref(database, `/incubation_cycles/${cyclePath}/history/${day}/temperature`);
  const humidityRef = ref(database, `/incubation_cycles/${cyclePath}/history/${day}/humidity`);

  onValue(temperatureRef, (snapshot) => {
    const temperature = snapshot.val();
    document.getElementById("temperature").textContent = temperature ? `${temperature}°C` : "--";
  });

  onValue(humidityRef, (snapshot) => {
    const humidity = snapshot.val();
    document.getElementById("humidity").textContent = humidity ? `${humidity}%` : "--";
  });

  document.getElementById("selectedDay").textContent = day;
}

// Load the current cycle when the page loads
document.addEventListener("DOMContentLoaded", loadCurrentCycle);
