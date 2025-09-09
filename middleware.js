const Listing=require('./models/listing.js');
const {listingschema,reviewschema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError");
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validatelisting =(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    console.log(req.body);
    let {error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}