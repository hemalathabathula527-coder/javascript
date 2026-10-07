async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    const weatherCard = document.getElementById("weather");
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    // Check empty input
    if (city === "") {
        error.textContent = "Please enter a city name.";
        weatherCard.style.display = "none";
        return;
    }

    // Reset messages
    error.textContent = "";
    weatherCard.style.display = "none";
    loading.style.display = "block";

    try {

        // Step 1: Find city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Failed to find city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city.");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kmh`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        // Step 3: Convert response to JSON
        const weatherData = await weatherResponse.json();

        // Step 4: Extract weather information
        const temperature =
            weatherData.current.temperature_2m;

        const humidity =
            weatherData.current.relative_humidity_2m;

        const windSpeed =
            weatherData.current.wind_speed_10m;

        // Step 5: Display data
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${temperature} °C`;

        document.getElementById("humidity").textContent =
            `${humidity} %`;

        document.getElementById("windSpeed").textContent =
            `${windSpeed} km/h`;

        weatherCard.style.display = "block";

    } catch (error) {

        console.error(error);

        error.textContent = error.message;

        weatherCard.style.display = "none";

    } finally {

        loading.style.display = "none";
    }
}


// Press Enter to search
document.getElementById("cityInput").addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {
            getWeather();
        }

    }
);