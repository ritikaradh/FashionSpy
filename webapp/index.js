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
app.use(express.static(path.join(__dirname, "public/javascript")));
app.use(express.static(path.join(__dirname, "public/css")))

app.listen(port, () => {
    console.log(`port is listening at port number ${port}`);
});

app.get("/:name", (req,res) => {
    let customers = ["Priya", "Ritika", "Tisha", "Anjali", "Eshita", "Munmun"];
    randIdx = Math.floor(Math.random()*customers.length)
    let name = customers[randIdx];
    // For the time being, consider this data to be coming from the database.

    let { name } = req.params;
