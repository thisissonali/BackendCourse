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
    import mongoose from "mongoose";
    import 'dotenv/config'
    import cookieParser from "cookie-parser";
    import  Jwt  from "jsonwebtoken";
    import bcrypt from "bcrypt";
    const app = Express();
    // const user = [];

    const DB = process.env.MONGO_URI

    mongoose.connect(DB).then(() => {
        console.log(`connection successful`);
    }).catch((err) => console.log(err));
    

    //Creation of schema
    const mongooseShema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String, 
            required : true,
        }
    })

    //creation of model -- collection

    // const messgeModel = mongoose.model("MessageModel", mongooseShema);
    const User = mongoose.model("User", mongooseShema);

    //setting up middlewares
    app.use(Express.static(path.join(path.resolve(), "public")));
    app.use(Express.urlencoded({ extended: true }));
    app.use(cookieParser())


    //setting up view engine
    app.set("view engine", "ejs");

    //authentication
    const isAuthenticated = async (req , res , next) => {
        const { token } = req.cookies;

        if (token) {
            const decoded = Jwt.verify(token, "sdfjhdbfjhdfkjdfkj");
            req.user = await User.findById(decoded._id);
            next();
        } else {
            res.redirect("/login");
        }
    }   

    app.get("/", isAuthenticated , (req, res) => {

        res.render("Logout", { name: req.user.name });
        // res.render("index" , {name : "Sonali"});
        
    });


    app.get("/login", (req, res) => {
        res.render("Login");
    })
 
    app.get("/register", (req, res) => {
    
        res.render("register");
        // res.render("index" , {name : "Sonali"});
        
    });

    app.post("/register",async (req, res) => {
        // res.send("User Logged In SuccessFully");

        const {name , email, password } = req.body;
        let user = await User.findOne({ email });
    
        if (user) {
            console.log("User already exists , redirecting to Login Page");
            res.redirect("/login");
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        //otherwise create a new user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        
        const token = Jwt.sign({ _id: user._id }, "sdfjhdbfjhdfkjdfkj");

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now()+ 60 * 1000)
        });
        res.redirect("/login");
        
    });

    app.post("/login", async (req, res) => { 
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            console.log("No user found with this email, Please register first");
            return res.redirect("/register");
        }
        // console.log(user.password);
        // console.log(password);
        // console.log(req.body);
        // const isMatch = user.password === req.body.password;
        const isMatch = await bcrypt.compare(password , user.password);

        if (!isMatch) { 
            return res.render("Login", { email , message: "Incorrect password" });
        }
        const token = Jwt.sign({ _id: user._id }, "sdfjhdbfjhdfkjdfkj");

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now()+ 60 * 1000)
        });
        res.redirect("/");
    })


    app.get("/logout", (req, res) => {
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now())
        });
        res.redirect("/")
    })

    // app.get("/add", async (req, res) => {
    //     await messgeModel.create({ name: "Sonali", email: "sonali@gmail.com", Message: "This is a new message" });
    //     res.send("Nice");
        
    // });

    // app.get("/success", (req, res) => { 
    //     res.render("success");
    // })


    // app.post("/contact", async (req, res) => {
    //     // console.log(req.body);
    //     // user.push({ userName: req.body.name, userEmail: req.body.email, userMessage: req.body.message });
    //     // res.send("success");  success string will be displayed on the browser
    //     // res.render("success")  succcess file in view will be displayed on the browser
    //     const {name , email, Message} = req.body;
    //     // const detailsEntered = { userName: req.body.name, userEmail: req.body.email, userMessage: req.body.Message };
    //    await messgeModel.create({ name, email, Message});
    //     // await messgeModel.create({ name: detailsEntered.userName, email: detailsEntered.userEmail, Message: detailsEntered.userMessage });
    //     res.redirect("/success"); // message will be sent to success route
    // });

    // app.get("/users", (req, res) => { 
    //     res.send(user);
    // })
    app.listen(5000, () => {
        console.log("Server is listening on port 5000");
    });