const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); //to get user input


const app=express();
app.use(bodyParser.urlencoded({extended: true})); //to get user input

app.get("/", function(req, res)
{
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res)
{
    const query = req.body.cityName; //get city name from user

    const apiKey = "1ded6a11a7a2147fbf2d6c7973291a57";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
    https.get(url, function(response)
    {
        console.log(response.statusCode);
        response.on("data", function(data)
        {
            const weatherData = JSON.parse(data);
            const temperature = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<h1>The temperature in " + query + " is " + temperature + " degree Celcius</h1>");
            res.write("<h3>The weather is currently " + description + "</h3>");
            res.write("<img src="+ imageURL +"></img>");
            res.send();
        });
    });
})

app.listen(3000, function(){
    console.log("Server is running on port 3000")
})