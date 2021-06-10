const got = require("got");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 8081;
process.env.data123 = "test";
const thirdPartyBaseUrl = "http://api.weatherbit.io/v2.0/current";
const thirdPartyApiKey = process.env.WEATHER_API_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(cors());
app.use(morgan("tiny"));

app.get("/api/weather", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude) {
      return res
        .status(400)
        .json({ message: "latitude parameter is mandatory" });
    }
    if (!longitude) {
      return res
        .status(400)
        .json({ message: "langitude parameter is mandatory" });
    }

    const response = await got(thirdPartyBaseUrl, {
      searchParams: {
        key: thirdPartyApiKey,
        lat: latitude,
        lon: longitude,
      },
      responseType: "json",
    });
    const [weatherData] = response.body.data;
    const {
      city_name,
      weather: { description },
      temp,
    } = weatherData;
    res.json({
      city_name,
      description,
      temp,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//   if (!req.body.goit) {
//     return res.status(400).json({ status: "goit parameter is required" });
//   }
//   res.json({ javascript: "awfawfawfaw", body: req.body });

app.listen(PORT, (err) => {
  if (err) console.error("Error at aserver launch:", err);
  console.log(`Server works at port ${PORT}!`);
});
