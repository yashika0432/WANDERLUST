const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const {listingschema,reviewschema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");



router.get("/", wrapAsync(async (req,res)=>{
    let alllist=await Listing.find({});
    res.render("./views/listings/index.ejs",{alllist});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./views/listings/new.ejs");
});

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:'reviews',populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("./views/listings/show.ejs",{listing});
    console.log(listing);

}));

router.post("/",isLoggedIn,validatelisting,
    wrapAsync(async (req,res,next)=>{
        let items=Listing(req.body.listing);
        
        if(items.image){
            items.image=JSON.parse(items.image);
        }
        const newlist=new Listing(items);
        newListing.owner=req.user._id;
        await newlist.save();
        req.flash("success","New Listing created!");
        res.redirect('/listings');
    }));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("./views/listings/edit.ejs",{listing});

}));

router.put("/:id",isLoggedIn,isOwner,validatelisting,
    wrapAsync(async (req,res)=>{
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedlist=await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing deleted !");

    res.redirect("/listings");
}));

module.exports=router;