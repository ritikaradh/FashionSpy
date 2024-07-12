const express = require("express");
const app = express();

//making view directory available at the backend directory
const path = require("path");

let port = 8080;

//setting template i.e., view engine to ejs
app.set("view engine", "ejs");

//making view  available at the backend not only for EJS directory
app.set("views", path.join(__dirname, "/views"));

//subtemplating
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/css")))


const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCb0VYilaCXsj0XEcsw6fkBLHsGckTm8sI");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

let topics = [
	"trending colors for this season?",
	"trending prints for this season?",
	"trending patterns for this season?",
	"Fashion Trends for Different Body Types",
	"Top 10 Fashion trends for 2024",
	"Workwear Evolution: Professional Fashion Trends for the Modern Office",
	"The Intersection of Fashion and Technology: Wearable Tech Trends",
	"The Rise of Sustainable Fashion: Eco-Friendly Trends to Follow",
];

let audience = [
	"fashion enthusiasts",
	"genZ",
	"working professionals",
	"college students",
	"upskilling genZ",
	"earning genZ",
];

let blog_topic = topics[Math.floor(Math.random()*topics.length)];
let blog_audience = audience[Math.floor(Math.random()*audience.length)];

async function run() {
	const prompt = `Write a fashion blog on the topic ${blog_topic} for ${blog_audience}`;
  
	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = response.text();
	console.log(text);
  }
  
let content = run();


//listening
app.listen(port, () => {
    console.log(`port is listening at port number ${port}`);
});

//view route
app.get("/", (req,res) => {
	let customers = ["Priya", "Ritika", "Tisha", "Anjali", "Eshita", "Munmun"];
	randIdx = Math.floor(Math.random()*customers.length)
	let name = customers[randIdx];
	// For the time being, consider this data to be coming from the database.

	// let { name } = req.params;

	res.render("blog.ejs", {customerName:name, blogContent: content});
	console.log(content);
	console.log("home page rendered successfully.");
});