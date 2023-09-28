/* by http module

// const htpp = require('http');
// const gfName = require('./features.js');
import htpp from 'http'; // can use this type of statements after changing the type of the module in package.json
// import gfName from './features.js';
import * as myObj from './features.js';
import fs from 'fs';

// Below is the reading of data in the file in an async way

// const Home = fs.readFile('./index.html', () => {
//   console.log("logging");
// });

//Below
// console.log(Home);
// const gfName = myObj.default

//If in  a synchornous way we want to access the data

const home = fs.readFileSync('./index.html');

// console.log(myObj.gfName2);
console.log(myObj.generateLovePercentage());
// console.log(gfName);
const server = htpp.createServer((req, res) => {
    // console.log(req.url);
    //there is no res.send() method in the http module's response object.
    //The res.end() method is used to send the response data and end the response stream. It's a low-level method that allows you to send raw data as the response. 
    //Express Js -->  res.send()
    
    // res.end("Hello, world!");
    if (req.url == "/") {

    //    fs.readFile('./index.html', (err , data) => {
    //        res.end(data); 
    //     });
        res.end(home);
    }
    else if (req.url == "/lovepercentage") {
        res.end(myObj.generateLovePercentage());
    }
    else if (req.url == "/about") {
        res.end("<h1>About Page</h1>");
    }
    else if (req.url == "/contacts") {
        res.end("<h1>Contact Page</h1>");
    }
    else {
        res.end("<h1>Page not found</h1>")
    }

});

const PORT = 5000;

server.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`); 
})

*/
/** 
import Express from "express";

const app = Express();

app.get("/getproducts", (req, res) => {
    res.send("This is server created with Express");
    res.sendStatus(500);
    res.status(400).send("Meri mrji");
    
    res.json({
        success: true,
        products: [],
    });
    
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});
*/
import Express from "express";
import path from 'path'

const app = Express();

app.use(Express.static(path.join(path.resolve(), "public")));

//setting up view engine
app.set("view engine", "ejs");

app.get("/",(req, res) => {
    res.render("index" , {name : "Sonali"});
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});