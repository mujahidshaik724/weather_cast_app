const fetchWeatherBtn = document.getElementById("fetchWeatherBtn");
const cityInput = document.getElementById("cityInput");
const weatherCards = document.getElementById("weatherCards");

const apiKey = "3de43bad810fca47eb18b1735106b1b2"; // Replace with your OpenWeather API key
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

// Retrieve city names from localStorage or initialize as an empty array
let cityNames = JSON.parse(localStorage.getItem("cityNames")) || [];

// Function to save city names to localStorage
function saveCityNames() {
    localStorage.setItem("cityNames", JSON.stringify(cityNames));
}

// Function to render weather cards
function renderWeather() {
    weatherCards.innerHTML = ""; // Clear existing cards

    cityNames.forEach(city => {
        const url = `${apiBaseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText} for ${city}`);
                }
                return response.json();
            })
            .then(data => {
                // Create a weather card
                const card = document.createElement("div");
                card.classList.add("weather-card");
                card.innerHTML = `
                    <h3>${data.name}</h3>
                    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                    <button class="delete-btn" data-city="${city}">Delete</button>
                `;

                // Add delete button functionality
                card.querySelector(".delete-btn").addEventListener("click", () => {
                    deleteCity(city);
                });

                weatherCards.appendChild(card);
            })
            .catch(error => {
                console.error(error);
                // Display error message
                const card = document.createElement("div");
                card.classList.add("weather-card");
                card.innerHTML = `<p>Error fetching weather for "${city}".</p>`;
                weatherCards.appendChild(card);
            });
    });
}

// Function to delete a city and update weather cards
function deleteCity(city) {
    cityNames = cityNames.filter(name => name !== city); // Remove city from list
    saveCityNames(); // Save updated list to localStorage
    renderWeather(); // Re-render weather cards
}

// Fetch weather when button is clicked
fetchWeatherBtn.addEventListener("click", () => {
    const cities = cityInput.value.split(",").map(city => city.trim()).filter(city => city && !cityNames.includes(city)); // New cities only

    if (cities.length === 0) {
        weatherCards.innerHTML = "<p>Please enter a valid city name or avoid duplicates.</p>";
        return;
    }

    cityNames.push(...cities); // Add cities to the list
    saveCityNames(); // Save updated list to localStorage
    renderWeather(); // Render updated weather cards
    cityInput.value = ""; // Clear the input
});

// Initial rendering of weather cards from localStorage
renderWeather();
