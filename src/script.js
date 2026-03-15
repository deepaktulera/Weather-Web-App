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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
    } else {
        console.log("Geolocation not supported");
    }
});

function setBackground(id) {
    
        switch (true) {
            
            case (id <= 232):
                wrapperDiv.style.backgroundImage = "url('background/thunderstrom.gif')";
                break;
                
                case (id <= 321):
                wrapperDiv.style.backgroundImage = "url('background/rain.gif')";
                break;
                
                case (id <= 531):
                    wrapperDiv.style.backgroundImage = "url('background/rain.gif')";
                    break;
 
                    case (id <= 622):
                        wrapperDiv.style.backgroundImage = "url('background/snow.gif')";
                break;

                case (id <= 781):
                wrapperDiv.style.backgroundImage = "url('background/atmosphere.gif')";
                break;

                case (id <= 800):
                wrapperDiv.style.backgroundImage = "url('background/clear.gif')";
                break;
                
                default:
                    wrapperDiv.style.backgroundImage = "url('background/clouds.gif')";
        }
    }

     function checkExtremeTemp(temp){

    if(temp >= 40){
        errorMsg.textContent = "⚠ Extreme Heat Warning! Temperature above 40°C";
        errorMsg.style.color = "red";
    }
}

searchBtn.addEventListener('click', () => {
    
    const city = cityInput.value.trim();
    
    if (city === "") {
        errorMsg.textContent = "Please enter a city name";
        return;
    }
    
    errorMsg.textContent = "";
    
    updateWeatherInfo(city);
    getForcast(city);
    saveCity(city);

    cityInput.value = '';
})

saveCity("Delhi"); 
saveCity("Mumbai"); 

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {

        const city = cityInput.value;

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
            const c = temp.dataset.temp;
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
    navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
});

if (upcomingContent) {
    upcomingContent.addEventListener("click", () => {

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

    forecastItemsContainer.innerHTML = "";

    const forecastForDays = forecast.list.filter(item => {
        const date = new Date(item.dt_txt).getHours();
        return date === 12;
    }).slice(0, 5);

    forecastForDays.forEach(item => {
        updateUpcomingForecast(item);
    });
}

async function getWeatherByCoords(lat, lon) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    const weatherData = await response.json();

    try{
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
    catch (err){
        console.log("City Not Found")
    }
}

async function getFetchData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData(city);

    try{

        if (!weatherData || weatherData.cod != 200 || !weatherData.main) {
            errorMsg.textContent = "City not found. Try again.";
            clearWeatherData();
            console.error('Invalid weather data:', weatherData);
            return;
        }
    }
    catch (err){
        console.log("City Invalid")
    }
        errorMsg.textContent = "";
        
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

    forecastItemsContainer.innerHTML = "";

    const forecastForDays = forecast.list.filter(item => {
        const date = new Date(item.dt_txt).getHours();
        return date === 12;
    }).slice(0, 5);

    forecastForDays.forEach(item => updateUpcomingForecast(item));
}

function updateUpcomingForecast(data) {

    const date = new Date(data.dt_txt);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });

    const formattedDate = `${day}-${month}`;

    const tempC = Math.floor(data.main.temp);

    const html = `
    <div class="time p-4 min-w-30 bg-slate-500/50 backdrop-blur-xl rounded-2xl">
        <h2>${formattedDate}</h2>
        <h2 class="forecast-temp" data-temp="${tempC}">${tempC} °C</h2>
        <img src="assest/${getWeatherIcon(data.weather[0].id)}">

        <p class="flex items-center gap-1">
            <span class="material-symbols-outlined">air</span>
            ${data.wind.speed} m/s
        </p>

        <p class="flex items-center gap-1">
            <span class="material-symbols-outlined">humidity_low</span>
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
        return;
    }

    recentCitiesDropdown.innerHTML = "";

    cities.forEach(city => {

        const option = document.createElement("option");
        option.textContent = city;

        recentCitiesDropdown.appendChild(option);
;        recentCitiesDropdown.style.backgroundColor = "transparent";
        recentCitiesDropdown.style.color = "black";
        
    });

    recentCitiesDropdown.style.display = "block";

}

recentCitiesDropdown.addEventListener("change", () => {

    const city = recentCitiesDropdown.value;

    updateWeatherInfo(city);
    getForcast(city);
});

function removeCites () {
    localStorage.removeItem("cities")
}

removeCitesBtn.addEventListener("click" , () =>{
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
    forecastItemsContainer.innerHTML = "--";
    
}