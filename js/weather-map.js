"use strict";

// ********VARIABLES**********
mapboxgl.accessToken = MAPBOX_API_KEY;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    zoom: 10,
    center: [-98.491142, 29.424349]
});

const fetchURL = `https://api.openweathermap.org/data/2.5`;
const wxIconURL = `https://openweathermap.org/img/wn/`;
const main = document.querySelector("main");
const mapSection = document.querySelector("#map-row");
const forecastSection = document.querySelector("#forecast-row");
const input = document.querySelector("input");
let userInput = document.querySelector("input").value;
const searchBtn = document.querySelector("#search-btn");
const currentLocation = document.querySelector("#current");

//**********FUNCTIONS***********

// ********SAN ANTONIO CURRENT FORECAST***********
const sACurrent = () => {
    fetch(fetchURL + `/weather?` + `id=4726206` + `&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
        .then(data => data.json())
        .then(currentWeather => {
            displayWXConditions(currentWeather);
            createMarker(currentWeather);
        })
        .catch(error => console.error(error));
}

// ***********SAN ANTONIO 5DAY FORECAST********
const sAFiveDay = () => {
    fetch(fetchURL + `/forecast?` + `id=4726206` + `&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
        .then(data => data.json())
        .then(forecast => {
            displayFiveDayForecast(forecast);
            createMarker(forecast);
        })
        .catch(error => console.error(error));
}

const userSearch = () => {
    geocode(`${userInput}`, MAPBOX_API_KEY).then(result => {
        map.setCenter(result);
        map.setZoom(10);
        fetch(fetchURL + `/forecast?` + `lat=${result[1]}&lon=${result[0]}` + `&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
            .then(data => data.json())
            .then(forecast => {
                displayFiveDayForecast(forecast);
                createMarker(forecast);
            })
            .catch(error => console.error(error));
    });
}

const createMarker = (data) => {
    let mapLat = data.coord.lat;
    let mapLng = data.coord.lon;
    const marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat([mapLng, mapLat])
        .addTo(map);
    const markerDragUpdate = () => {
        const lngLat = marker.getLngLat();
        let updateLng = lngLat.lng;
        let updateLat = lngLat.lat;

        reverseGeocode({lng: updateLng, lat: updateLat}, MAPBOX_API_KEY).then(results => {
            displayLocation(results);
        });

        const displayLocation = (results) => {
            currentLocation.textContent = results;
        }

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [updateLng, updateLat],
            zoom: 8
        });

        marker.setLngLat([updateLng, updateLat])
            .addTo(map);


        fetch(fetchURL + `/forecast?` + `lat=${updateLat}&lon=${updateLng}` + `&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
            .then(data => data.json())
            .then(forecast => {
                displayFiveDayForecast(forecast);
            })
            .catch(error => console.error(error));
    }
    marker.on('dragend', markerDragUpdate);
}

const displayWXConditions = (currentWeather) => {
    forecastSection.innerHTML = "";
    const wxIcon = wxIconURL + currentWeather.weather[0].icon + '.png';
    forecastSection.innerHTML =
        `<div id="currentForecast">
            <div class="card">
                <p>${convertDateTime(currentWeather.dt)}</p>
                <h2>Current Conditions</h2>
                <h3>${currentWeather.main.temp.toFixed(0)}</h3>
                <span><img src="${wxIcon}"  alt=""/></span>
                <p>${currentWeather.weather[0].description}</p>
            </div>
        </div>`
}

const displayFiveDayForecast = (forecast) => {
    forecastSection.innerHTML = "";
    forecast.list.forEach((day, index) => {
        if (index % 8 === 0) {
            const wxFiveIcon = wxIconURL + day.weather[0].icon + '.png';
            forecastSection.innerHTML +=
                `<div id="fiveDayForecast">  
                    <div class="card">
                        <p>${convertDateTime(day.dt)}</p>
                        <h3>${day.main.temp.toFixed(0)}</h3>
                        <span><img src="${wxFiveIcon}"  alt=""/></span>
                        <p>${day.weather[0].description}</p>
                    </div>
                </div>`
        }
    })
}

const convertDateTime = (dt) => {
    const milliseconds = dt * 1000;
    const dateObject = new Date(milliseconds);
    const readableDate = dateObject.toLocaleDateString();
    return (readableDate);
}


// *********EVENT LISTENERS********
input.addEventListener("input", (event) => {
    userInput = event.target.value;
})

searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    currentLocation.textContent = userInput.toUpperCase();
    userSearch();
})

sACurrent();
// sAFiveDay();