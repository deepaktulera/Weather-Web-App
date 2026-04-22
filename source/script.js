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
const closeBtn = document.getElementById("close")
const wrapperDiv = document.getElementById("wrapper");
const upcomingContent = document.getElementById("upcoming");
const sidebar = document.getElementById("important-links");
const sidebarBtns = document.querySelectorAll(".important-links button");
const forecastItemsContainer = document.getElementById("forecastItems");
const errorMsg = document.getElementById("error-msg");
const recentCitiesDropdown = document.getElementById("recent-cities");
const removeCitesBtn = document.getElementById("remove-cities");

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
    errorMsg.style.color = "white";
    errorMsg.style.backgroundColor = "rgba(220, 38, 38, 0.9)";
    errorMsg.style.padding = "10px 14px";
    errorMsg.style.borderRadius = "10px";
    errorMsg.style.marginTop = "10px";
    errorMsg.style.fontWeight = "600";

    clearTimeout(showError.timeoutId);
    showError.timeoutId = setTimeout(() => {
        hideError();
    }, 4000);
}

function hideError() {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
}

function saveCity(city) {

    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if (!cities.includes(city)) {
        cities.push(city);
    }

    localStorage.setItem("cities", JSON.stringify(cities));

    showRecentCities();
}

window.addEventListener("load", () => {
    showRecentCities();
    hideError();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
    } else {
        showError("Geolocation not supported by your browser.");
    }
});

function setBackground(id) {

    if (id <= 232) {
        wrapperDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1567913300214-364d5256df1c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }
    else if (id <= 321) {
        wrapperDiv.style.backgroundImage = "url('https://plus.unsplash.com/premium_photo-1666725974723-a42869909d0c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }
    else if (id <= 531) {
        wrapperDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1620385019253-b051a26048ce?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }
    else if (id <= 622) {
        wrapperDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1548777123-e216912df7d8?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }
    else if (id <= 781) {
        wrapperDiv.style.backgroundImage = "url('background/atmosphere.gif')";
    }
    else if (id <= 800) {
        wrapperDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1587124318790-ad54e29fec80?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }
    else {
        wrapperDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1463947628408-f8581a2f4aca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }
}

function checkExtremeTemp(temp) {
    if (temp >= 40) {
        showError("⚠ Extreme Heat Warning! Temperature above 40°C");
    }
}

searchBtn.addEventListener('click', () => {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name");
        return;
    }

    hideError();

    updateWeatherInfo(city);
    getForcast(city);
    saveCity(city);

    cityInput.value = '';
})

saveCity("Delhi");
saveCity("Mumbai");

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        const city = cityInput.value.trim();

        if (city === "") {
            showError("Please enter a city name");
            return;
        }

        hideError();

        updateWeatherInfo(city);
        getForcast(city);
        saveCity(city)

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

        const fahrenheit = (currentTemp * 9 / 5) + 32;
        tempTxt.textContent = Math.round(fahrenheit) + "°F";
        degreeText.innerText = "°F";

        forecastTemps.forEach(temp => {
            const c = Number(temp.dataset.temp);
            const f = (c * 9 / 5) + 32;
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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
    } else {
        showError("Geolocation not supported by your browser.");
    }
});

if (upcomingContent) {
    upcomingContent.addEventListener("click", () => {

    });
}

function gotLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    hideError();
    getWeatherByCoords(lat, lon);
    getForecastByCoords(lat, lon);
}

function failLocation(error) {
    console.error("Failed to get location", error);

    if (!error) {
        showError("Unable to get your current location.");
        return;
    }

    switch (error.code) {
        case error.PERMISSION_DENIED:
            showError("Location access denied. Please allow location permission.");
            break;
        case error.POSITION_UNAVAILABLE:
            showError("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            showError("Location request timed out.");
            break;
        default:
            showError("Unable to get your current location.");
            break;
    }
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
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Forecast API request failed");
        }

        const forecast = await response.json();

        if (!forecast || forecast.cod != "200" || !forecast.list) {
            forecastItemsContainer.innerHTML = "";
            showError("Forecast not available for current location.");
            return;
        }

        forecastItemsContainer.innerHTML = "";

        const forecastForDays = forecast.list.filter(item => {
            const date = new Date(item.dt_txt).getHours();
            return date === 12;
        }).slice(0, 5);

        forecastForDays.forEach(item => {
            updateUpcomingForecast(item);
        });
    } catch (error) {
        console.error("Forecast by coords error:", error);
        forecastItemsContainer.innerHTML = "";
        showError("Failed to fetch forecast for current location.");
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Weather API request failed");
        }

        const weatherData = await response.json();

        if (!weatherData || weatherData.cod != 200 || !weatherData.main) {
            showError("Unable to fetch weather for current location.");
            clearWeatherData();
            return;
        }

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
        checkExtremeTemp(currentTemp);

        setBackground(id);

        conditionTxt.textContent = main;
        current_dateTxt.textContent = getCurrentDate();
        windTxt.textContent = speed + ' m/s';
        conditionImg.src = `assest/${getWeatherIcon(id)}`;
        feelTxt.textContent = Math.floor(feels_like) + '°C';
        sunriseTxt.textContent = formatTime(sunrise);
        humidityTxt.textContent = humidity + '%';
        sunsetTxt.textContent = formatTime(sunset);
    }
    catch (err) {
        console.error("Current location weather error:", err);
        clearWeatherData();
        showError("Failed to fetch current location weather.");
    }
}

async function getFetchData(city) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404) {
                return { cod: 404 };
            }
            throw new Error("Weather API request failed");
        }

        return await response.json();
    } catch (error) {
        console.error("getFetchData error:", error);
        throw error;
    }
}

async function updateWeatherInfo(city) {
    try {
        hideError();

        const weatherData = await getFetchData(city);

        if (!weatherData || weatherData.cod != 200 || !weatherData.main) {
            showError("City not found. Try again.");
            clearWeatherData();
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
        checkExtremeTemp(currentTemp);
        setBackground(id);
        conditionTxt.textContent = main;
        current_dateTxt.textContent = getCurrentDate();
        windTxt.textContent = speed + ' m/s';
        conditionImg.src = `assest/${getWeatherIcon(id)}`;
        feelTxt.textContent = Math.floor(feels_like) + '°C';
        sunriseTxt.textContent = formatTime(sunrise);
        humidityTxt.textContent = humidity + '%';
        sunsetTxt.textContent = formatTime(sunset);
    }
    catch (err) {
        console.error("updateWeatherInfo error:", err);
        forecastItemsContainer.innerHTML = "";
        showError("Unable to fetch weather data. Please check your internet connection.");
        clearWeatherData();
    }
}

async function getForecastData(city) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json()

        if (!response.ok) {
            if (data.status === 404) {
                return { cod: "404" };
            }
            throw new Error("Forecast API request failed");
        }
        
        return data;
    } catch (error) {
        console.error("getForecastData error:", error);
        throw error;
    }
}

async function getForcast(city) {
    try {
        const forecast = await getForecastData(city);
        

        if (!forecast || forecast.cod != "200" || !forecast.list) {
            forecastItemsContainer.innerHTML = "";
            showError("Forecast data not available.");
            return;
        }

        forecastItemsContainer.innerHTML = "";

        const forecastForDays = forecast.list.filter(item => {
            const date = new Date(item.dt_txt).getHours();
            return date === 21;
        }).slice(0, 5);

        forecastForDays.forEach(item => updateUpcomingForecast(item));
    } catch (error) {
        console.error("Forecast API Error:", error);
        forecastItemsContainer.innerHTML = "";
        showError("Unable to fetch forecast data.");
    }
}

function updateUpcomingForecast(data) {

    const date = new Date(data.dt_txt);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });

    const formattedDate = `${day}-${month}`;

    const tempC = Math.floor(data.main.temp);

    const html = `
    <div class="p-4 min-w-30  backdrop-blur-xs bg-transparent text-black font-semibold rounded-2xl">
        <h2>${formattedDate}</h2>
        <h2 class="forecast-temp" data-temp="${tempC}">${tempC} °C</h2>
        <img src="assest/${getWeatherIcon(data.weather[0].id)}">

        <p class="flex w-full items-center p-1">
            <span class="material-symbols-outlined text-black font-semibold">air</span>
            ${data.wind.speed} m/s
        </p>

        <p class="flex w-full items-center p-1">
            <span class="material-symbols-outlined text-black font-semibold">humidity_low</span>
            ${data.main.humidity}%
        </p>
    </div>
`;

    forecastItemsContainer.insertAdjacentHTML("beforeend", html);
}

function openMenu() {
    wrapperDiv.style.gridTemplateColumns = "1fr 3fr";
    sidebar.style.display = "flex";
    sidebar.style.flexDirection = "column";
    menuBtn.style.display = "none";
}

function closeMenu() {
    wrapperDiv.style.gridTemplateColumns = "1fr"
    if (window.innerWidth < 640) {
        sidebar.style.display = "none";
    }

    menuBtn.style.display = "block";
}

menuBtn.addEventListener("click", (openMenu));
closeBtn.addEventListener("click", closeMenu);

function showRecentCities() {

    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if (cities.length === 0) {
        recentCitiesDropdown.style.display = "none";
        recentCitiesDropdown.innerHTML = "";
        return;
    }

    recentCitiesDropdown.innerHTML = "";

    cities.forEach(city => {

        const option = document.createElement("option");
        option.textContent = city;
        option.value = city;

        recentCitiesDropdown.appendChild(option);
        recentCitiesDropdown.style.backgroundColor = "transparent";
        recentCitiesDropdown.style.color = "black";

    });

    recentCitiesDropdown.style.display = "block";

}

recentCitiesDropdown.addEventListener("change", () => {

    const city = recentCitiesDropdown.value;

    if (!city) return;

    updateWeatherInfo(city);
    getForcast(city);
});

function removeCites() {
    localStorage.removeItem("cities");
    showRecentCities();
    showError("Recent cities removed successfully.");
}
removeCitesBtn.addEventListener("click", () => {
    removeCites()
})

function clearWeatherData() {

    cityTxt.textContent = "--";
    tempTxt.textContent = "--";
    conditionTxt.textContent = "--";
    windTxt.textContent = "--";
    feelTxt.textContent = "--";
    sunriseTxt.textContent = "--";
    humidityTxt.textContent = "--";
    sunsetTxt.textContent = "--";
    current_dateTxt.textContent = "--";
    forecastItemsContainer.innerHTML = "";

}