// Helper
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// Units
//let lang = "en-US";
let lang = "de-DE";
function changeLanguage() {
  lang = lang === "en-US" ? "de-DE" : "en-US";
  document.querySelector("#lang-icon").src =
    lang === "de-DE" ? "images/usa-flag.png" : "images/german-flag.png";
  updateView();
  updateSearchLabel();
}
document
  .querySelector("#lang-selector")
  .addEventListener("click", changeLanguage);

function updateView() {
  let now = new Date();
  let city = getCityName();
  updateTitle(city);
  updateTimestamp(now);
  updateForecast(now);

  // InitTemp
  axios.get(getApiUrlWithCityName(city)).then(updateWeatherInfo);
}

// Initialize Date and Time
updateView();

// Update
function getCityName() {
  let cityInput = document.querySelector("#location");
  return cityInput.value === "" ? "Aachen" : cityInput.value;
}
function updateTitle(cityName) {
  let cityUpdate = document.querySelector("#city-title");
  cityUpdate.innerHTML = cityName;
}
function updateTimestamp(date) {
  document.querySelector(".date").innerHTML = date.toLocaleDateString(lang, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function updateForecast(date) {
  let allForecast = document.querySelectorAll(".forecast-day");
  for (let index = 0; index < allForecast.length; index++) {
    const element = allForecast[index];
    let forecastDay = date.addDays(index + 1);
    element.innerHTML = forecastDay.toLocaleDateString(lang, {
      weekday: "short",
    });
  }
}

function getApiUrlWithCityName(cityName) {
  const apiKey = "855d2851678ff543e15aab7ea5e6ebd4";
  let unit = lang === "en-US" ? "imperial" : "metric";
  let langShort = lang === "en-US" ? "en" : "de";
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}&lang=${langShort}`;
}

function updateIcon(response) {
  let imageSource = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
  document.querySelector("#weather-icon").src = imageSource;
}
function updateTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#currentTemperature");
  let unit = lang === "en-US" ? "°F" : "°C";
  temperatureElement.innerHTML = `${temperature} ${unit}`;
}
function updateDescription(response) {
  let description = response.data.weather[0].description;
  document.querySelector("#description").innerHTML = description;
}
function updateHumidity(response) {
  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  let humidityLabel = lang === "en-US" ? "Humidity" : "Luftfeuchtigkeit";
  humidityElement.innerHTML = `${humidityLabel} ${humidity} %`;
}
function updateWind(response) {
  let wind = Math.round(response.data.wind.speed);
  let windElement = document.querySelector("#wind");
  let unit = lang === "en-US" ? "mph" : "m/s";
  windElement.innerHTML = `Wind ${wind} ${unit}`;
}

function updateWeatherInfo(response) {
  updateIcon(response);
  updateTemperature(response);
  updateDescription(response);
  updateHumidity(response);
  updateWind(response);
}

function updateSearchLabel() {
  document.querySelector("#location").placeholder =
    lang === "en-US" ? "Search city" : "Ort suchen";
  document.querySelector("#current-location").innerHTML =
    lang === "en-US" ? "Current Location" : "Aktueller Ort";
}

function submitForm(event) {
  event.preventDefault();
  updateView();
}

document.querySelector("#search-field").addEventListener("submit", submitForm);

function getCityWithGeoData(lat, lon) {
  const apiKey = "855d2851678ff543e15aab7ea5e6ebd4";

  return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}&units=metric`;
}

function writeCurrentLocationInSearchBox(response) {
  let cityInput = document.querySelector("#location");
  cityInput.value = response.data[0].name;
  updateView();
}

function showPositionAndTemperature(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  axios.get(getCityWithGeoData(lat, lon)).then(writeCurrentLocationInSearchBox);
}

function getWeatherCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showPositionAndTemperature);
}
document
  .querySelector("#current-location")
  .addEventListener("click", getWeatherCurrentLocation);
