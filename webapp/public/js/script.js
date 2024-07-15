const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
let recommendationStr = "What to wear according to my current location";
let awaitingCity = false;

const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const ChatLi = document.createElement("li");
    ChatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    ChatLi.innerHTML = chatContent;
    ChatLi.querySelector("p").textContent = message;
    return ChatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = " https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCb0VYilaCXsj0XEcsw6fkBLHsGckTm8sI";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }]
        })
    };

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const getProductRecommendations = (temperature) => {
    const productRecommendations = {
        cold: ["Woolen sweater", "Winter Jacket", "Scarf"],
        mild: ["T-shirt", "Jeans", "Sneakers"],
        hot: ["Sleeveless tops", "Sunscreen", "Swimwear", "Hot-pants"]
    };

    if (temperature <= 15) {
        return productRecommendations.cold;
    } else if (temperature > 15 && temperature <= 25) {
        return productRecommendations.mild;
    } else {
        return productRecommendations.hot;
    }
};

const fetchWeatherData = async (city) => {
    const apiKey = '48dfaf64e3d0fe6d31b3f42d3f27b8f0'; // Replace with your OpenWeatherMap API key
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return {
        temperature: data.main.temp,
        cityName: data.name
    };
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    if (awaitingCity) {
        fetchWeatherData(userMessage).then(({ temperature, cityName }) => {
            const recommendedProducts = getProductRecommendations(temperature);
            const responseMessage = `Current temperature in ${cityName} is ${temperature}°C. Recommended Products: ${recommendedProducts.join(', ')}`;

            const incomingChatLi = createChatLi(responseMessage, "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }).catch((error) => {
            const errorMessage = "Error fetching weather data";
            const incomingChatLi = createChatLi(errorMessage, "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
        awaitingCity = false;
    } else {
        if (userMessage.toLowerCase() === recommendationStr.toLowerCase()) {
            awaitingCity = true;
            const incomingChatLi = createChatLi("Please enter your city:", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        } else {
            setTimeout(() => {
                const incomingChatLi = createChatLi("Thinking...", "incoming");
                chatbox.appendChild(incomingChatLi);
                chatbox.scrollTo(0, chatbox.scrollHeight);
                generateResponse(incomingChatLi);
            }, 600);
        }
    }
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
