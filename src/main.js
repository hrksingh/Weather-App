import "./style.css";
import { findTimeZone, getZonedTime } from "timezone-support";

import singleDayPage from "./singleDay.js";
import forecast from "./7DayForecast.js";
import logo from "/weather-icons/weather-forecast.png";

document.querySelector(".logo-weather").src = logo;

const api_key = import.meta.env.VITE_API_KEY;
const baseUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

const elements = {
  contentDiv: document.querySelector(".content"),
  input: document.querySelector("input"),
  searchDiv: document.querySelector(".search"),
  temp: document.querySelector(".temp"),
  siteNav: document.querySelector("nav"),
  impBtn: document.querySelector(".fn"),
  metricBtn: document.querySelector(".metric"),
};

const units = {
  imp: "us",
  metric: "metric",
};

let currentUnits = units.metric;
let metricSelected = true;
let weatherData = null;
let lastLocal = elements.input.value;
let singlePageShowing = true;

function toggleUnits() {
  currentUnits = metricSelected ? units.imp : units.metric;
  metricSelected = !metricSelected;
  updateUnitBtns();
}

function updateUnitBtns() {
  if (metricSelected) {
    elements.metricBtn.classList.add("selected");
    elements.impBtn.classList.remove("selected");
  } else {
    elements.metricBtn.classList.remove("selected");
    elements.impBtn.classList.add("selected");
  }
}

function getZonedHour(timezoneCode) {
  const timezone = findTimeZone(timezoneCode);
  return getZonedTime(Date.now(), timezone).hours;
}

function getLocal() {
  return elements.input.value;
}

function getCurrentLocal() {
  const localTitleH1 = document.querySelector(".local");
  return localTitleH1 ? localTitleH1.textContent : null;
}

async function fetchWeatherData(location) {
  const url = `${baseUrl}${location}/next7days?unitGroup=${currentUnits}&key=${api_key}&contentType=json`;

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    showErrorToUser(error);
  }
}

function showErrorToUser(error) {
  if (error.message.includes("429")) {
    alert("Too many requests, come back tomorrow.");
  } else if (error.message.includes("400")) {
    alert("Invalid location.");
  } else {
    alert("Something went wrong.");
  }
}

function clearPage() {
  elements.contentDiv.innerHTML = "";
}

async function showSingleDayPage(setLocation = null) {
  if (weatherData === null) {
    const local = setLocation === null ? getLocal() : setLocation;
    try {
      weatherData = await fetchWeatherData(local);
    } catch (error) {
      console.log(error);
      showErrorToUser(error);
      return;
    }
  }

  const timezoneCorrectedHour = getZonedHour(weatherData.timezone);
  const currentDay = weatherData.days[0];
  clearPage();
  singleDayPage.createPage(
    weatherData.resolvedAddress,
    currentDay.tempmin,
    currentDay.tempmax,
    currentDay.hours[timezoneCorrectedHour],
    currentDay.hours,
    metricSelected
  );
}

async function showForecastPage(setLocation = null) {
  if (weatherData === null) {
    const local = setLocation === null ? getLocal() : setLocation;
    try {
      weatherData = await fetchWeatherData(local);
    } catch (error) {
      console.log(error);
      showErrorToUser(error);
      return;
    }
  }

  clearPage();
  forecast.createPage(weatherData.days, weatherData.resolvedAddress);
}

function handleUnitButtonClick() {
  const location = getCurrentLocal();
  weatherData = null;
  if (singlePageShowing) {
    showSingleDayPage(location);
  } else {
    showForecastPage(location);
  }
}
// Event Listeners
elements.searchDiv.addEventListener("click", function (event) {
  if (event.target.matches(".unit-btn")) {
    handleUnitButtonClick();
  }
});

elements.temp.addEventListener("click", function (event) {
  if (event.target.matches(".unit-btn")) {
    if (metricSelected && event.target.matches(".metric")) {
      return;
    } else if (!metricSelected && event.target.matches(".fn")) {
      return;
    }
    toggleUnits();
    updateUnitBtns();
    handleUnitButtonClick();
  }
});

elements.siteNav.addEventListener("click", function (event) {
  if (event.target.matches(".today-btn")) {
    showSingleDayPage();
    singlePageShowing = true;
  } else if (event.target.matches(".forecast-btn")) {
    showForecastPage();
    singlePageShowing = false;
  }
});

elements.input.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && elements.input.value !== "") {
    if (elements.input.value === lastLocal) {
      return;
    }
    lastLocal = elements.input.value;
    weatherData = null;
    if (singlePageShowing) {
      showSingleDayPage();
    } else {
      showForecastPage();
    }
  }
});

// Initial Page Load
showSingleDayPage();
