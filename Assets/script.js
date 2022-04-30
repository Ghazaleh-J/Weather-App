var oneCallEndPointUrl = "https://api.openweathermap.org/data/2.5/onecall"
var city = "Irvine"
var apiKey = "fc9179d977bc1ac53ba567c6c820e30c"
var weatherEndPointUrl = "https://api.openweathermap.org/data/2.5/weather"

var inputValue = document.getElementById("whatCity")
var clickMe = document.getElementById("click")
var currentWeatherContainer = document.getElementById("currentWeather")

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
var humid = document.createElement("p");
humid.innerText = "Humidity: " + data.current.humidity
humid.setAttribute("class", "bg-success text-light")
var icons = document.createElement("img")
icons.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon +"@2x.png" )
currentWeatherContainer.append(humid, icons)

}
