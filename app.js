const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); //to get user input
const _ = require("lodash");

const app=express();


var temperature="";
var description="";
var icon="";
var imageURL = "";
var query="";
var humidity="";
var wind="";
var country = "";
var tempMin="";
var tempMax="";


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true})); //to get user input
app.use(express.static("public"));

app.get("/", function(req, res)
{
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res)
{
    query = _.capitalize(req.body.cityName); //get city name from user

    const apiKey = "1ded6a11a7a2147fbf2d6c7973291a57";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
    https.get(url, function(response)
    {
        console.log(response.statusCode);
        response.on("data", function(data)
        {
            const weatherData = JSON.parse(data);
            temperature = weatherData.main.temp;
            description = weatherData.weather[0].description;
            icon = weatherData.weather[0].icon;
            imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            humidity = weatherData.main.humidity;
            wind = Math.round(weatherData.wind.speed*3.6);
            tempMin = weatherData.main.temp_min;
            tempMax = weatherData.main.temp_max;
            let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
            country = regionNames.of(weatherData.sys.country);

            //var h1Text ="The temperature in " + query + " is " + temperature + " degree Celcius";
            //var h3Text ="The weather is currently " + description;
            /*res.write("<h1>The temperature in " + query + " is " + temperature + " degree Celcius</h1>");
            res.write("<h3>The weather is currently " + description + "</h3>");
            res.write("<img src="+ imageURL +"></img>");*/
            //console.log(h1Text, h3Text);
        });
    });
    setTimeout(function(){res.render("weather", {cityName: query, temp: temperature, descrip: description, img: imageURL, humid: humidity, windy: wind, country: country, min:tempMin, max: tempMax})}, 2500);
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})



