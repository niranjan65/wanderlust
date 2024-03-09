if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');

const listingRouter = require("./routes/lisitng");
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user.js');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const { error } = require('console');



main().then(()=>{
    console.log("Connected to Db")
}).catch((error)=>{
    console.log(error)
})
async function main(){
    await mongoose.connect(`${process.env.MONGO_URL}`, {
        useNewUrlParser: true,
  useUnifiedTopology: true,
    })
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: `${process.env.MONGO_URL}`,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitilized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

store.on("ERROR in MONGO SESSION STORE", error)



app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    res.locals.currUser = req.user;
    next();
})

app.use('/listings', listingRouter)
app.use('/listings/:id/reviews', reviewRouter)
app.use('/', userRouter)


// app.get("/demouser", async (req, res)=> {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

app.get("/", (req, res)=>{
    res.send("Hello! I am root");
})

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found"))
})

app.use((err, req, res, next) => {
    let {statusCode, message} = err;
    // res.status(500).send("Something went wrong");
    res.status(500).render("error.ejs", {message});
});

// ;( async () => {
//     try {
//         await mongoose.connection(`${process.env.MONGO_URL}/${DB_NAME}`)
//     } catch (error) {
//         console.log(error)
//         throw error
//     }
// })()

// connectDB()

app.listen(8080, ()=>{
    console.log("Server is running at 8080");
})