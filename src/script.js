
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search");
const cityTxt = document.getElementById("city-name")
const currectLocationBtn = document.getElementById("currect-location");
const tempTxt = document.getElementById("temp")
const conditionTxt = document.getElementById("condition")
const current_dateTxt = document.getElementById("current_date");
const conditionImg = document.getElementById("condition_img"); 
const windTxt = document.getElementById("wind");
const feelTxt = document.getElementById("feel");
const sunriseTxt = document.getElementById("sunrise")
const humidityTxt = document.getElementById("humidity");
const sunsetTxt = document.getElementById("sunset");

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
    } else {
        console.log("Geolocation not supported");
    }
});


function gotLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherByCoords(lat, lon);
}

function failLocation() {
    console.log("Failed to get location");
}

currectLocationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(gotLocation, failLocation);
});

function getWeatherIcon(id){
    if(id<= 232) return 'thunderstorm.svg'
    if(id<= 321) return 'drizzle.svg'
    if(id<= 531) return 'rain.svg'
    if(id<= 622) return 'snow.svg'
    if(id<= 781) return 'atmosphere.svg'
    if(id<= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currectDate = new Date()
    const options = {
        weekday : 'short',
        day : '2-digit',
        month : 'short'
    }
    return currectDate.toLocaleDateString('en-GB' , options);
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
    tempTxt.textContent = Math.floor(temp) + '°C';
    conditionTxt.textContent = main;
    current_dateTxt.textContent = getCurrentDate();
    windTxt.textContent = speed + ' m/s';
    conditionImg.src = `assest/${getWeatherIcon(id)}`;
    feelTxt.textContent = Math.floor(feels_like) + '°C';
    sunriseTxt.textContent = formatTime(sunrise);
    humidityTxt.textContent = humidity + '%';
    sunsetTxt.textContent = formatTime(sunset);
}

