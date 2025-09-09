const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require('./routes/listing.js');
const reviewsRouter=require('./routes/reviews.js');
const userRouter=require('./routes/user.js');


app.set("view engine","ejs");
app.set("views",path.join(__dirname),"views");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());



main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); 
}

const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized: true

};

app.get("/",(req,res)=>{
    res.send("i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//    let registeredUser=await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



app.all("/{*any}", (req, res, next) => {
    const comm=new ExpressError(404, "Page not found");
    next(comm);
});

app.use((err,req,res,next)=>{
    const {status=500,message="something went wrong"}=err;
    res.status(status).render("./views/listings/error.ejs",{err});
    // res.status(status).send(message);
});

app.listen(8080,(req,res)=>{
    console.log("server is listening to 8080");
});