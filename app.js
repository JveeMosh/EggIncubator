import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("Firebase initialized:", app); // Log the Firebase initialization

function fetchData() {
  const temperatureRef = ref(database, "DHT/temperature");
  const humidityRef = ref(database, "DHT/humidity");
  const dateStartRef = ref(database, "Date_start");

  // Listen for temperature changes
  onValue(temperatureRef, (snapshot) => {
    const temperature = snapshot.val();
    document.getElementById("temperature").textContent = temperature || "--";

    if (temperature < 35) {
      displayNotification(
        "temperatureNotification",
        "Temperature is below normal range!"
      );
    } else if (temperature > 39) {
      displayNotification(
        "temperatureNotification",
        "Warning: Temperature is above normal range!"
      );
    } else {
      hideNotification("temperatureNotification");
    }
  });

  // Listen for humidity changes
  onValue(humidityRef, (snapshot) => {
    const humidity = snapshot.val();
    document.getElementById("humidity").textContent = humidity || "--";

    if (humidity < 65) {
      displayNotification(
        "humidityNotification",
        "Humidity is below normal range!"
      );
    } else if (humidity > 70) {
      displayNotification(
        "humidityNotification",
        "Warning: Humidity is above normal range!"
      );
    } else {
      hideNotification("humidityNotification");
    }
  });

  // Listen for changes to Date_start
  onValue(dateStartRef, (snapshot) => {
    const dateStart = snapshot.val();
    if (dateStart) {
      const now = Date.now();
      const daysSinceStart = Math.floor(
        (now - dateStart) / (1000 * 60 * 60 * 24) + 1
      );
      document.getElementById("daysSinceStart").textContent =
        daysSinceStart || "--";

      if (daysSinceStart >= 21) {
        document.getElementById("hatchingNotification").style.display = "block";
      }
    }
  });
}

function displayNotification(id, message) {
  const notification = document.getElementById(id);
  notification.textContent = message;
  notification.style.display = "block";
}

function hideNotification(id) {
  const notification = document.getElementById(id);
  notification.style.display = "none";
}

fetchData();
