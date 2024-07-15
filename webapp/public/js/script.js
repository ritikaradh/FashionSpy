const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
let recommmendationStr = "What to wear according to my current location";

const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    
    const ChatLi = document.createElement("li");
    ChatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    ChatLi.innerHTML = chatContent;
    ChatLi.querySelector("p").textContent = message;
    return ChatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = " https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCb0VYilaCXsj0XEcsw6fkBLHsGckTm8sI";
    const messageElement = incomingChatLi.querySelector("p");
    
    const requestOptions = {
        method:"POST",
        headers:{
        "Content-Type": "application/json"
        
        },
        body: JSON.stringify({
            contents:[{parts:[{text:userMessage}]}]
        
        })
    }


    fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    if(userMessage === recommmendationStr){
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
    }
    else{
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;
        
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {

            const incomingChatLi = createChatLi("Thinking...", "incoming")
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        },600);
    }}


chatInput.addEventListener("input", () => {
    
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    

    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
