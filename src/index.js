//date time
let now = new Date();

function formatDate(today) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let year = today.getFullYear();
  let month = months[today.getMonth()];
  let daysOfTheWeek = days[today.getDay()];
  let day = today.getDate();
  let hours = today.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let time = `${daysOfTheWeek} | ${month} ${day}, ${year} | ${hours}:${minutes}`;

  return time;
}

let timeAndDate = document.querySelector("#time-date");
timeAndDate.innerHTML = formatDate(now);

//weather info
function displayWeather(response) {
  //console.log(response.data);

  let mainTemperature = document.querySelector("#main-temp");
  let cityName = document.querySelector("#city-name");
  let feelsLike = document.querySelector("#feels-like");
  let humidity = document.querySelector("#humidity");
  let windSpeed = document.querySelector("#wind-speed");
  let iconElement = document.querySelector("#weather-icon");

  cityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  mainTemperature.innerHTML = Math.round(response.data.main.temp);
  feelsLike.innerHTML = `Feels like: ${Math.round(
    response.data.main.feels_like
  )}°C`;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  windSpeed.innerHTML = `Wind Speed: ${Math.round(
    response.data.wind.speed
  )} km/h`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

//search city
function searchCity(city) {
  let apiKey = "76bd1c0ff8311a8d7f2ae10658044361";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeather);
}

function enterCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let submitButton = document.querySelector("#city-form");
submitButton.addEventListener("submit", enterCity);

//search current location
function searchLocation(position) {
  let apiKey = "76bd1c0ff8311a8d7f2ae10658044361";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function searchCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let clickCurrentLocation = document.querySelector(".location-pin");
clickCurrentLocation.addEventListener("click", searchCurrentLocation);

//para lumabas na default search ito kung sakaling walang data sa indexhtml
searchCity("Davao");

//daily temp coords
function getForecast(coordinates) {
  //console.log(coordinates);
  let apiKey = "76bd1c0ff8311a8d7f2ae10658044361";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayDailyForecast);
}

//daily temp
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayDailyForecast(response) {
  //console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastDaily = document.querySelector("#daily-forecast");

  let forecastRow = `<div class="row">`;
  forecast.forEach(function (forecastday, displayeddate) {
    if (displayeddate < 6)
      forecastRow =
        forecastRow +
        `<div class="col-2">
                  <div class="daily-temp-date">${formatDay(
                    forecastday.dt
                  )}</div>
                  <img
                    src="http://openweathermap.org/img/wn/${
                      forecastday.weather[0].icon
                    }@2x.png"
                    width="50"
                    id="daily-temp-img"
                  />
                  <div class="temperature">
                    <div class="daily-temp-max">Max: ${Math.round(
                      forecastday.temp.max
                    )}°</div>
                    <div class="daily-temp-min">Min: ${Math.round(
                      forecastday.temp.min
                    )}°</div>
                  </div>
                </div>`;
  });
  forecastRow = forecastRow + `</div>`;
  forecastDaily.innerHTML = forecastRow;
}
