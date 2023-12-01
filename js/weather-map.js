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
const input = document.querySelector("input");
let userInput = document.querySelector("input").value;
const searchBtn = document.querySelector("#search-btn");
const currentLocation = document.querySelector("#current");



// ********FOR CURRENT FORECAST***********
fetch(fetchURL + `/weather?` + `id=4726206` + `&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
    .then(data => data.json())
    .then(currentWeather => {
        displayWXConditions(currentWeather);
        createMarker(currentWeather);
    })
    .catch(error => console.error(error));


// ***********FOR 5DAY FORECAST********
fetch(fetchURL + `/forecast?` + `id=4726206` + `&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
    .then(data => data.json())
    .then(forecast => {
        displayFiveDayForecast(forecast);
    })
    .catch(error => console.error(error));


//**********FUNCTIONS***********
const userSearch = () => {
    geocode(`${userInput}`, MAPBOX_API_KEY).then(result => {
        map.setCenter(result);
        map.setZoom(10);
        fetch(fetchURL + `/forecast?` + `lat=${result[1]}&lon=${result[0]}` + `&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
            .then(data => data.json())
            .then(forecast => {
                displayFiveDayForecast(forecast);
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

        reverseGeocode({lng: updateLng, lat: updateLat}, MAPBOX_API_KEY).
        then( results => {
            displayLocation(results);
        });

        const displayLocation = (results) => {
            currentLocation.textContent = results;
        }

        const wxSections = document.querySelectorAll("section");
        wxSections[0].classList.add("hidden");
        wxSections[1].classList.add("hidden");
        wxSections[2].classList.remove("hidden");

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
    const dateTime = document.createElement("p");
    dateTime.innerText = convertDateTime(currentWeather.dt);
    const tempHeader = document.createElement("h2");
    tempHeader.innerText = "Current Conditions";
    const temp = document.createElement("h3");
    temp.innerText = currentWeather.main.temp.toFixed(0);
    const icon = document.createElement("span");
    const wxIcon = wxIconURL + currentWeather.weather[0].icon + '.png';
    icon.innerHTML = '<img src="' + wxIcon + '" />';
    const description = document.createElement("p");
    description.innerText = currentWeather.weather[0].description;
    const tempSection = document.createElement("section");
    tempSection.classList.add("row");
    const daily = document.createElement("div");
    daily.classList.add("card");
    tempSection.appendChild(daily);
    daily.appendChild(dateTime);
    daily.appendChild(tempHeader);
    daily.appendChild(temp);
    daily.appendChild(icon);
    daily.appendChild(description);
    main.insertBefore(tempSection, mapSection);
}


const displayFiveDayForecast = (forecast) => {
    const tempFiveSection = document.createElement("section");
    tempFiveSection.classList.add("row");
    forecast.list.forEach((day, index) => {
        if (index % 8 === 0) {
            const daily = document.createElement("div")
            daily.classList.add("card");
            const dateTime = document.createElement("p");
            dateTime.innerText = convertDateTime(day.dt);
            const dailyTemp = document.createElement("h3");
            dailyTemp.innerText = day.main.temp.toFixed(0);
            const fiveIcon = document.createElement("span");
            const wxFiveIcon = wxIconURL + day.weather[0].icon + '.png';
            fiveIcon.innerHTML = '<img src="' + wxFiveIcon + '" />';
            const fiveDayDescription = document.createElement("p");
            fiveDayDescription.innerText = day.weather[0].description;
            tempFiveSection.appendChild(daily);
            daily.appendChild(dateTime);
            daily.appendChild(dailyTemp);
            daily.appendChild(fiveIcon);
            daily.appendChild(fiveDayDescription);
            main.insertBefore(tempFiveSection, mapSection);
        }
        const sections = document.querySelectorAll("section");
        if (sections.length > 2) {
            for (let i = sections.length - 3; i >= 0; i--) {
                sections[i].classList.add("hidden");
            }
        }
    });
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