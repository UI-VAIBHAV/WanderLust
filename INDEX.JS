if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport  = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/user.js");
const userRouter = require("./routes/user.js");
const {isLoggedin,isOwner,validateReview,validateListing,isAuthor} = require("./middleware.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
const dburl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})
// async function main(){
//     await mongoose.connect(dburl);
// }
async function main() {
  try {
    await mongoose.connect(dburl, {
      tls: true,                        // Required for Atlas or SSL-enabled servers
      tlsAllowInvalidCertificates: false // Keep false for production
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}


const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600
})


store.on("error", (err) => {
    console.log("Error in mongo session store:", err);
});

const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
} 

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/", userRouter);

app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong!!"} = err;
    res.status(statuscode).render("error.ejs",{message});
})

app.listen(8080,(req,res)=>{
    console.log("connection is working for port 8080");
})