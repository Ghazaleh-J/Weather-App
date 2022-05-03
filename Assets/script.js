// Variables
var oneCallEndPointUrl = "https://api.openweathermap.org/data/2.5/onecall"
var city = ""
var date = moment().format("MM/DD/YYYY")

var apiKey = "fc9179d977bc1ac53ba567c6c820e30c"
var weatherEndPointUrl = "https://api.openweathermap.org/data/2.5/weather"

// DOM Element References
var inputValue = document.getElementById("whatCity")
var clickMe = document.getElementById("click")
var currentWeatherContainer = document.getElementById("currentWeather")
var futureWeatherContainer = document.getElementById("futureWeather")
var eachDayContainer = document.getElementById("eachDay")


 function getWeather (){

    fetch (weatherEndPointUrl + `?q=${encodeURI(city)}&appid=${apiKey}`)
    .then (function (cityResponse){
        return cityResponse.json();
    })
    .then (function (cityData){
        var lat = cityData.coord.lat;
        var lon = cityData.coord.lon;
        
        fetch (oneCallEndPointUrl + `?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then (function (oneCallResponse){
            return oneCallResponse.json();
        })
        .then (function (oneCallData){
            console.log(oneCallData)
            displayCurrentWeather(oneCallData);
            displayFutureWeather(oneCallData);
        })
    })
}


clickMe.addEventListener("click", function (event){
    event.preventDefault();
    city = inputValue.value
    getWeather();
})

function displayCurrentWeather (data){
console.log(data.current)
var cityDate = document.createElement("h3");
var temp = document.createElement("p");
var wind = document.createElement("p");
var humidity = document.createElement("p");
var uvIndex = document.createElement("p");
var uvBadge = document.createElement("button");
var tempKelvin = data.current.temp
cityDate.innerText = `${city} (${date})`
temp.innerText = "Temp: " + (((tempKelvin-273.15)*1.8)+32) + " °F"
wind.innerText = "Wind: " + data.current.wind_speed + " MPH"
humidity.innerText = "Humidity: " + data.current.humidity + " %"
uvIndex.innerText = "UV Index: " 
uvBadge.innerText =  data.current.uvi
uvBadge.setAttribute("class", "btn")
if (data.current.uvi < 3) {
    uvBadge.setAttribute("class", "btn-success")
} else if (data.current.uvi< 7) {
    uvBadge.setAttribute("class", "btn-warning")
} else {
    uvBadge.setAttribute("class", "btn-danger")
}

uvIndex.append(uvBadge)

var icons = document.createElement("img")
icons.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon +"@2x.png" )
currentWeatherContainer.append(cityDate, icons, temp, wind, humidity, uvIndex)

}



function displayFutureWeather (data){
    console.log(data.daily) 
    for (var i = 1; i < 6; i++) {
        var tempp = document.createElement("p");
        var windd = document.createElement("p");
        var humidityy = document.createElement("p");
        var temppKelvin = data.daily[i].temp.day
        tempp.innerText = "Temp: " + (((temppKelvin-273.15)*1.8)+32) + " °F"  
        windd.innerText = "Wind: " + data.daily[i].wind_speed + " MPH"
        humidityy.innerText = "Humidity: " + data.daily[i].humidity + " %"
        var iconss = document.createElement("img")
        iconss.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon +"@2x.png" )
        // eachDayContainer.setAttribute("class", "col-md, card")
        eachDayContainer.append(tempp, windd, humidityy, iconss)
        futureWeatherContainer.append(eachDayContainer);

    }
}
