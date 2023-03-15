// Units
let lang = "en-US";
//let lang = "de-DE";
function changeLanguage() {
  lang = lang === "en-US" ? "de-DE" : "en-US";
  updateView();
}
document
  .querySelector("#lang-selector")
  .addEventListener("click", changeLanguage);

function updateView() {
  let now = new Date();
  document.querySelector(".date").innerHTML = now.toLocaleDateString(lang, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let allForecast = document.querySelectorAll(".forecast-day");
  for (let index = 0; index < allForecast.length; index++) {
    const element = allForecast[index];
    let forecastDay = now.addDays(index + 1);
    element.innerHTML = forecastDay.toLocaleDateString(lang, {
      weekday: "short",
    });
  }

  // InitTemp
  axios.get(getApiUrlWithCityName("Aachen")).then(updateWeatherInfo);

  // InitSearchLabel
  document.querySelector("#location").placeholder =
    lang === "en-US" ? "Search city" : "Ort suchen";
}

// Initialize Date and Time
updateView();

// Update
function getApiUrlWithCityName(cityName) {
  const apiKey = "855d2851678ff543e15aab7ea5e6ebd4";

  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
}

function updateTitle(cityName) {
  let cityUpdate = document.querySelector("#city-title");
  cityUpdate.innerHTML = cityName;
}

function updateTemperature(response) {
  console.log(response);
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#currentTemperature");
  temperatureElement.innerHTML = `${temperature} °C`;
}

function updateHumidity(response) {
  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  let humidityLabel = lang === "en-US" ? "Humidity" : "Luftfeuchtigkeit";
  humidityElement.innerHTML = `${humidityLabel} ${humidity} %`;
}

function updateWind(response) {
  let wind = Math.round(response.data.wind.speed * 3.6);
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `Wind ${wind} km/h`;
}

function updateWeatherInfo(response) {
  updateTemperature(response);
  updateHumidity(response);
  updateWind(response);
}

function submitForm(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#location");
  updateTitle(cityInput.value);
  axios.get(getApiUrlWithCityName(cityInput.value)).then(updateWeatherInfo);
}

document.querySelector("#search-field").addEventListener("submit", submitForm);

function getApiUrlWithGeoData(lat, lon) {
  const apiKey = "855d2851678ff543e15aab7ea5e6ebd4";

  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
}

function showPositionAndTemperature(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  axios.get(getApiUrlWithGeoData(lat, lon)).then(updateWeatherInfo);
}

function getWeatherCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showPositionAndTemperature);
}
document
  .querySelector("#current-location")
  .addEventListener("click", getWeatherCurrentLocation);
