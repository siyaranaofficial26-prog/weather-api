const express = require('express');
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(cors());
const helmet = require("helmet");
app.use(helmet());
app.get('/', (req, res) => {
  res.send('Hello from my API');
});
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
//endpoints
app.get('/weather', async (req, res) => {
   
const city = req.query.city; //read the city from url
if (!city) {
    return res.status(400).json({
        error: "Please provide a city name."
    });
}
 try{
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;
const response = await axios.get(url);
console.log(response.data);
res.json({
    city: response.data.name,
    country: response.data.sys.country,
    temperature: response.data.main.temp,
    feels_like: response.data.main.feels_like,
    humidity: response.data.main.humidity,
    weather: response.data.weather[0].main,
    description: response.data.weather[0].description,
    wind_speed: response.data.wind.speed
});
    }
    catch(error){
       return res.status(401).json({
        error:"City not found"
       });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
