const express = require("express"); //simplifies the application process
const mongoose = require("mongoose");   //to interact with mongodb
const bodyParser = require("body-parser"); //simplifies the data from client side
const dotenv = require("dotenv");   //to hide username and passwords

const app=express();    //instance
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.3d8uumq.mongodb.net/registrationFormDB`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

//model of registration schema
const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})

app.post("/register",async (req,res)=>{
    try {
        const {name, email, password} = req.body;

        const existingUser = await Registration.findOne({email:email});
        if(!existingUser){
            //create a user
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error")
        }

    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})