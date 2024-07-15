// Step 1: Set Up Product Recommendations
const productRecommendations = {
    cold: ["Woolen sweater", "Winter Jacket", "Scarf" ],
    mild: ["T-shirt", "Jeans", "Sneakers"],
    hot: ["Sleveless tops", "Sunscreen", "Swimwear","Hot-pants"]
};

// Step 2: Create a Function to Get Product Recommendations
function getProductRecommendations(temperature) {
    if (temperature <= 15) {
        return productRecommendations.cold;
    } else if (temperature > 15 && temperature <= 25) {
        return productRecommendations.mild;
    } else {
        return productRecommendations.hot;
    }
}

// Step 3: Fetch Temperature and City Name from Weather API
const prompt = require("prompt-sync")();
const apiKey = '48dfaf64e3d0fe6d31b3f42d3f27b8f0'; // Replace with your OpenWeatherMap API key
let city = prompt("Please enter your city: ") // Replace with your desired city
console.log(city)

async function fetchWeatherData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    const temperature = data.main.temp;
    const cityName = data.name;
    return { temperature, cityName };
}

// Step 4: Combine Everything and Display Recommendations
async function displayRecommendations() {
    try {
        const { temperature, cityName } = await fetchWeatherData();
        console.log(`Current temperature in ${cityName} is ${temperature}°C`);
        const recommendedProducts = getProductRecommendations(temperature);

        console.log("Recommended Products based on the current temperature:");
        recommendedProducts.forEach(product => {
            console.log("- " + product);
        });
    } catch (error) {
        console.log("Error fetching weather data");
    }
}

// Call the function to display recommendations
displayRecommendations();
