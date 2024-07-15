const express = require("express");
const app = express();
const path = require("path");
let port = 8080;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/prerequisites")));

//blog-generator
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { type } = require("os");
const genAI = new GoogleGenerativeAI("AIzaSyCb0VYilaCXsj0XEcsw6fkBLHsGckTm8sI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
let topics = [
	"trending colors for this season?",
	"trending prints for this season?",
	"trending patterns for this season?",
	"Fashion Trends for Different Body Types",
	"Top 10 Fashion trends for 2025",
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

//listening
app.listen(port, () => {
    console.log(`port is listening at port number ${port}`);
});

//index route
app.get("/", (req, res)=>{
	res.render("home.ejs");
});

//view route
app.get("/fashionspy", async(req, res) => {

	let blog_topic = topics[Math.floor(Math.random()*topics.length)];
	let blog_audience = audience[Math.floor(Math.random()*audience.length)];

	async function run() {
		const prompt = `Write a fashion blog on the topic ${blog_topic} for ${blog_audience}, remember to start the blog body by stating 'Let's start.'`;
	  
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		return text;
	}

	let content = await run();
	// console.log(typeof(content));

	//post-processing- removing unnecessary characters
	let contentStr = await content.toString();
	contentStr = await contentStr.replaceAll("*", "");
	contentStr = await contentStr.replaceAll("#", "");
	// console.log(contentStr);
	
	let title = await contentStr.slice(0, contentStr.indexOf(":"));
	// console.log(body)

	res.render("blog.ejs", {blogTitle: title, blogContent : contentStr});	
});