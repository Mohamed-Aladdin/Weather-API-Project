const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/", (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;

  https.get(url, (response) => {
    // console.log(response.statusCode);

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const weatherTemp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      //To avoid displaying the actual html tags in the body of the web page we use the setHeader method.
      res.setHeader("Content-Type", "text/html");
      res.write(`<h3>The weather is currently ${weatherDescription}.</h3>`);
      res.write(`<h1>The weather in ${city} is ${weatherTemp} C.</h1>`);
      res.write(`<img src=${imgURL} alternative="weather-icon">`);
      res.send();
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000.");
});