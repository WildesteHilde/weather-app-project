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
  updateForecastDays(now);

  // InitTemp
  axios.get(getApiUrlWithCityName(city)).then(updateWeatherInfo);
  axios.get(getForecastApiUrlWithCityName(city)).then(updateForecastInfo);
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
function updateForecastDays(date) {
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
function getForecastApiUrlWithCityName(cityName) {
  const apiKey = "855d2851678ff543e15aab7ea5e6ebd4";
  let unit = lang === "en-US" ? "imperial" : "metric";
  let langShort = lang === "en-US" ? "en" : "de";
  return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}&lang=${langShort}&cnt=5`;
}
function getIconSource(iconId) {
  return `https://openweathermap.org/img/wn/${iconId}@2x.png`;
}
function updateMainIcon(response) {
  document.querySelector("#weather-icon").src = getIconSource(
    response.data.weather[0].icon
  );
}
function updateVideo(response) {
  let videoSource = "";
  let weatherConditionCode = response.data.weather[0].id;

  switch (weatherConditionCode) {
    case 200:
    case 201:
    case 202:
    case 210:
    case 211:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
      videoSource = "videos/thunderstorm.mp4";
      break;
    case 300:
    case 301:
    case 302:
    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:
      videoSource = "videos/drizzle.mp4";
      break;
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
    case 511:
    case 520:
    case 521:
    case 522:
    case 531:
      videoSource = "videos/rain.mp4";
      break;
    case 600:
    case 601:
    case 602:
    case 611:
    case 612:
    case 613:
    case 615:
    case 616:
    case 620:
    case 621:
    case 622:
      videoSource = "videos/snow.mp4";
      break;
    case 701:
    case 711:
    case 721:
    case 731:
    case 741:
    case 751:
    case 761:
    case 762:
    case 771:
    case 781:
      videoSource = "videos/athmosphere.mp4";
      break;
    case 800:
    case 801:
    case 802:
    case 803:
    case 804:
    default:
      videoSource = "videos/cloudy sky.mp4";
      break;
  }
  document.querySelector("#video").src = videoSource;
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
function updateForecastInfo(response) {
  console.log(response.data.list);
  // Temperature
  let allForecast = document.querySelectorAll(".forecast-temp-min");
  for (let index = 0; index < allForecast.length; index++) {
    const element = allForecast[index];
    element.innerHTML =
      Math.round(response.data.list[index].main.temp_min) + "°";
  }
  allForecast = document.querySelectorAll(".forecast-temp-max");
  for (let index = 0; index < allForecast.length; index++) {
    const element = allForecast[index];
    element.innerHTML =
      Math.round(response.data.list[index].main.temp_max) + "°";
  }

  // Icon
  allForecast = document.querySelectorAll(".forecast-weather-icon");
  for (let index = 0; index < allForecast.length; index++) {
    const element = allForecast[index];
    element.src = getIconSource(response.data.list[index].weather[0].icon);
  }
}

function updateWeatherInfo(response) {
  updateMainIcon(response);
  updateVideo(response);
  updateTemperature(response);
  updateDescription(response);
  updateHumidity(response);
  updateWind(response);
  updateForecastInfo(response);
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
