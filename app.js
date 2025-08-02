const params = new URLSearchParams(window.location.search);
const cityInput = document.querySelector("input[name=q]");

const cityName = params.get("q")?.trim() || "Vancouver";
cityInput.value = cityName;

async function getData(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  let cityName = params.get("q");

  const populationData = await getData(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
  );

  const latitude = populationData.results[0].latitude;
  const longitude = populationData.results[0].longitude;

  const weatherData = await getData(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
  );

  buildWeather(weatherData);
  buildContry(populationData);
});

function buildWeather(data) {
  document.querySelector(".city-name").textContent = `${data.timezone}  `;
  document.querySelector(
    ".temperutre"
  ).textContent = `${data.current.temperature_2m} ${data.current_units.temperature_2m}  `;

  document.querySelector(
    ".Low"
  ).textContent = `${data.daily.temperature_2m_min} ${data.current_units.temperature_2m}`;

  document.querySelector(
    ".high"
  ).textContent = `${data.daily.temperature_2m_max} ${data.current_units.temperature_2m}`;

  if (`${data.current.is_day}` === 1) {
    document.querySelector(".day-img").style.display = "block";
    document.querySelector(".night-img").style.display = "none";
  } else {
    document.querySelector(".day-img").style.display = "none";
    document.querySelector(".night-img").style.display = "block";
  }
}

function buildContry(data) {
  document.querySelector(
    ".country"
  ).textContent = `${data.results[0].country}  `;
  document.querySelector(
    ".timezone"
  ).textContent = `${data.results[0].timezone}  `;
  document.querySelector(
    ".population"
  ).textContent = `${data.results[0].population}  `;
}
