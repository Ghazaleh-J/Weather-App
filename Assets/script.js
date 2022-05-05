// Variables
var oneCallEndPointUrl = "https://api.openweathermap.org/data/2.5/onecall"
var city = ""
var date = moment().format("MM/DD/YYYY")

var apiKey = "fc9179d977bc1ac53ba567c6c820e30c"
var weatherEndPointUrl = "https://api.openweathermap.org/data/2.5/weather"
var cityArray = JSON.parse(localStorage.getItem("searchedCity"))?JSON.parse(localStorage.getItem("searchedCity")):[];

// DOM Element References
var inputValue = document.getElementById("whatCity")
var clickMe = document.getElementById("click")
var cardContainer = document.getElementById("cardContainer")
var currentWeatherContainer = document.getElementById("currentWeather")
var forcast = document.getElementById("forcast")
var groupContainer = document.getElementById("group")
var futureWeatherContainer = document.getElementById("futureWeather")
var eachDayContainer = document.getElementById("eachDay")
var searchHistoryContainer = document.getElementById("side")
var listContainer = document.getElementById("history")


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
            cityArray.push(city)
            localStorage.setItem("searchedCity",JSON.stringify(cityArray))
            searchHistory();
        })
    })
}


clickMe.addEventListener("click", function (event){
    event.preventDefault();
    city = inputValue.value.trim();
    inputValue.value = "";
    
    if (! city) {
        return;
    }
    
    getWeather();
    
})

function displayCurrentWeather (data){
console.log(data.current)
currentWeatherContainer.innerHTML = ""
var cityDate = document.createElement("h3");
var temp = document.createElement("p");
var wind = document.createElement("p");
var humidity = document.createElement("p");
var uvIndex = document.createElement("p");
var uvBadge = document.createElement("button");
var tempKelvin = data.current.temp
cityDate.innerText = `${city} (${date})`
temp.innerText = "Temp: " + Math.floor((((tempKelvin-273.15)*1.8)+32)) + " °F"
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
cardContainer.setAttribute("class", "card w-75")
cityDate.setAttribute("class", "card-title")
temp.setAttribute("class", "card-text")
wind.setAttribute("class", "card-text")
humidity.setAttribute("class", "card-text")


uvIndex.append(uvBadge)

var icons = document.createElement("img")
icons.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon +"@2x.png" )
cityDate.append(icons)
currentWeatherContainer.append(cityDate, temp, wind, humidity, uvIndex)


}





function displayFutureWeather (data){
    console.log(data.daily) 
    forcast.innerHTML = ""
    var futureForcast = document.createElement("h4")
futureForcast.innerText = "5-Day Forcast:"
forcast.append(futureForcast)
futureWeatherContainer.innerHTML = ""

    for (var i = 1; i < 6; i++) {
        
        var tempp = document.createElement("p");
        var windd = document.createElement("p");
        var humidityy = document.createElement("p");
        var eachCard = document.createElement("div")

        var futureDate = document.createElement("p")
        var temppKelvin = data.daily[i].temp.day
        
        tempp.innerText = "Temp: " + Math.floor((((temppKelvin-273.15)*1.8)+32)) + " °F"  
        windd.innerText = "Wind: " + data.daily[i].wind_speed + " MPH"
        humidityy.innerText = "Humidity: " + data.daily[i].humidity + " %"
        futureDate.innerText = moment().add(i, "days").format("MM/DD/YYYY")
        var iconss = document.createElement("img")
        iconss.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon +"@2x.png" )
        
        
        tempp.setAttribute("class", "card-text")
        windd.setAttribute("class", "card-text")
        humidityy.setAttribute("class", "card-text")
        eachCard.setAttribute("class", "card equalCard")

        eachCard.append(futureDate, tempp, windd, humidityy, iconss)
        futureWeatherContainer.append(eachCard);
        
    }
}

function searchHistory (){
    listContainer.innerHTML = ""
    for (var i = 0; i < cityArray.length; i++) {

        var searched = document.createElement("button")
        searched.innerText = cityArray[i];
        searched.setAttribute("class", "btn btn-sm btn-outline-secondary")
        listContainer.append(searched);
        searched.addEventListener("click", function(event){
            event.preventDefault ()
            city = event.target.innerText
            getWeather()
        })
    }
    
}

searchHistory();

