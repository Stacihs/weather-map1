function appendLeadingZeroes(n){
    if(n <= 9){
        return "0" + n;
    }
    return n;
}

function dateFromTimeStamp(timeStamp){
    let dateTime = new Date(timeStamp * 1000);
    let year = dateTime.getFullYear();
    let month = appendLeadingZeroes(dateTime.getMonth() + 1);
    let day = dateTime.getUTCDate();
    let hours = dateTime.getHours();
    return `${year}-${month}-${day} ${hours}:00`;
}

function windCardinalDirection(degrees){
    let cardinalDirection = '';
    if ((degrees > 348.75 && degrees <= 360) || (degrees >=0 && degrees <= 11.25)){
        cardinalDirection = "N";
    } else if (degrees > 11.25 && degrees  <= 33.75) {
        cardinalDirection = "NNE";
    } else if (degrees > 33.75 && degrees <= 56.25) {
        cardinalDirection = "NE";
    } else if (degrees > 56.25 && degrees <= 78.75) {
        cardinalDirection = "ENE";
    } else if (degrees > 78.75 && degrees <= 101.25) {
        cardinalDirection = "E";
    } else if (degrees > 101.25 && degrees <= 123.75) {
        cardinalDirection = "ESE";
    } else if (degrees > 123.75 && degrees <= 146.25) {
        cardinalDirection = "SE";
    } else if (degrees > 146.25 && degrees <= 168.75) {
        cardinalDirection = "SSE";
    } else if (degrees > 168.75 && degrees <= 191.25) {
        cardinalDirection = "S";
    } else  if (degrees > 191.25 && degrees <= 213.75) {
        cardinalDirection = "SSW";
    } else if (degrees > 213.75 && degrees <= 236.25)  {
        cardinalDirection = "SW";
    } else if (degrees > 236.25 && degrees <= 258.75) {
        cardinalDirection = "WSW";
    } else if (degrees > 258.75 && degrees <= 281.25) {
        cardinalDirection = "W";
    } else if (degrees > 281.25 && degrees <= 303.75) {
        cardinalDirection = "WNW";
    } else if (degrees > 303.75 && degrees <= 326.25) {
        cardinalDirection = "NW";
    } else if (degrees > 326.75 && degrees <= 348.75) {
        cardinalDirection = "NNW";
    }
    return cardinalDirection;
}

function mostFrequent(array){
    const arrayElementsCount = array.reduce(function(total, element){
        if (!total[element]) {
            total[element] = 1;
        } else {
            total[element] = total[element] + 1;
        }
        return total;
    }, {});
    const arraySorted = Object.entries(arrayElementsCount).sort(function(a, b){
        return b[1] - a[1];
    });
    return arraySorted[0][0];
}

function average(array){
    let total = 0;
    array.forEach((element, index, array)=>total+=element);
    return total/array.length;
}

const daysOfWeekAbbreviated = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayOfWeekFromDayAbbreviated(timeStamp){
    let dateTime = new Date(timeStamp * 1000);
    return daysOfWeekAbbreviated[dateTime.getDay()];
}