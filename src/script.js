const apiKey = '33e848ca17ce143b67f1c7d6f27eb75c'

const apiCallAny = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}'
const apiCallCurrent = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&lang=en'
const apiCallForecast = 'https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}'



const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search");
const cityTxt = document.getElementById("city-name");
const changeDegreeTxt = document.getElementById("changeDegree");
const degreeText = document.getElementById("degree");
const currectLocationBtn = document.getElementById("currect-location");
const tempTxt = document.getElementById("temp");
const conditionTxt = document.getElementById("condition")
const current_dateTxt = document.getElementById("current_date");
const conditionImg = document.getElementById("condition_img");
const windTxt = document.getElementById("wind");
const feelTxt = document.getElementById("feel");
const sunriseTxt = document.getElementById("sunrise")
const humidityTxt = document.getElementById("humidity");
const sunsetTxt = document.getElementById("sunset");
const menuBtn = document.querySelector(".menu");
const upcomingContent = document.getElementById("upcoming");
const sidebar = document.querySelector(".important-links");
const sidebarBtns = document.querySelectorAll(".important-links button");
const forecastItemsContainer = document.getElementById("forecastItems");


window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
    } else {
        console.log("Geolocation not supported");
    }
});


searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        const city = cityInput.value;

        updateWeatherInfo(city);
        getForcast(city);

        cityInput.value = '';
        cityInput.blur();
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        const city = cityInput.value;

        updateWeatherInfo(city);
        getForcast(city);

        cityInput.value = '';
        cityInput.blur();
    }
})

let currentTemp = null;
let isCelsius = true;

changeDegreeTxt.addEventListener("click", () => {
    
    if (currentTemp === null) return;
    
    const forecastTemps = document.querySelectorAll(".forecast-temp");
    
    if (isCelsius) {
        
        const fahrenheit = (currentTemp * 9/5) + 32;
        tempTxt.textContent = Math.round(fahrenheit) + "°F";
        degreeText.innerText = "°F";
        
        forecastTemps.forEach(temp => {
            const c = temp.dataset.temp;
            const f = (c * 9/5) + 32;
            temp.textContent = Math.round(f) + " °F";
        });
        
    } 
    else {

        tempTxt.textContent = currentTemp + "°C";
        degreeText.innerText = "°C";

        forecastTemps.forEach(temp => {
            const c = temp.dataset.temp;
            temp.textContent = c + " °C";
        });

    }

    isCelsius = !isCelsius;
});

currectLocationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
});

if (upcomingContent) {
    upcomingContent.addEventListener("click", () => {
        console.log("Hello");
    });
}

function gotLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeatherByCoords(lat, lon);
    getForecastByCoords(lat, lon);
}

function failLocation() {
    console.log("Failed to get location");
}


function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const currectDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currectDate.toLocaleDateString('en-GB', options);
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes}`;
}

async function getForecastByCoords(lat, lon) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    const forecast = await response.json();

    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];

    forecastItemsContainer.innerHTML = "";

    forecast.list.forEach(item => {
        if (item.dt_txt.includes(timeTaken) && !item.dt_txt.includes(todayDate)) {
            updateUpcomingForecast(item);
        }
    });
}

async function getWeatherByCoords(lat, lon) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    const weatherData = await response.json();

    if (weatherData.cod != 200) return;

    const {
        name,
        main: { humidity, temp, feels_like },
        weather: [{ id, main }],
        sys: { sunrise, sunset },
        wind: { speed },
    } = weatherData;

    cityTxt.textContent = name;
    currentTemp = Math.floor(temp);
    tempTxt.textContent = currentTemp + '°C';
    conditionTxt.textContent = main;
    current_dateTxt.textContent = getCurrentDate();
    windTxt.textContent = speed + ' m/s';
    conditionImg.src = `assest/${getWeatherIcon(id)}`;
    feelTxt.textContent = Math.floor(feels_like) + '°C';
    sunriseTxt.textContent = formatTime(sunrise);
    humidityTxt.textContent = humidity + '%';
    sunsetTxt.textContent = formatTime(sunset);
}


async function getFetchData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData(city);
    if (!weatherData || weatherData.cod != 200 || !weatherData.main) {
        console.error('Invalid weather data:', weatherData);
        return;
    }

    const {
        name: country,
        main: { humidity, temp, feels_like },
        weather: [{ id, main }],
        sys: { sunrise, sunset },
        wind: { speed },
    } = weatherData

    cityTxt.textContent = country;
    currentTemp = Math.floor(temp);
    tempTxt.textContent = currentTemp + '°C';
    conditionTxt.textContent = main;
    current_dateTxt.textContent = getCurrentDate();
    windTxt.textContent = speed + 'm/s';
    conditionImg.src = `assest/${getWeatherIcon(id)}`;
    feelTxt.textContent = Math.floor(feels_like) + '°C';
    sunriseTxt.textContent = formatTime(sunrise);
    humidityTxt.textContent = humidity + '%';
    sunsetTxt.textContent = formatTime(sunset);

}

async function getForecastData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function getForcast(city) {
    const forecast = await getForecastData(city);

    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];

    forecastItemsContainer.innerHTML = "";

    forecast.list.forEach(item => {
        if (item.dt_txt.includes(timeTaken) && !item.dt_txt.includes(todayDate)) {
            updateUpcomingForecast(item);
        }
    });
}

function updateUpcomingForecast(data) {

    const date = new Date(data.dt_txt);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });

    const formattedDate = `${day}-${month}`;

    const tempC = Math.floor(data.main.temp);

    const html = `
        <div class="time p-4">
            <h2>${formattedDate}</h2>
            <h2 class="forecast-temp" data-temp="${tempC}">${tempC} °C</h2>
            <img src="assest/${getWeatherIcon(data.weather[0].id)}">
        </div>
    `;

    forecastItemsContainer.insertAdjacentHTML("beforeend", html);
}