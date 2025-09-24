const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let alllist = await Listing.find({});
  res.render("./views/listings/index.ejs", { alllist });
};

module.exports.rendernewform = (req, res) => {
  res.render("./views/listings/new.ejs");
};

module.exports.showlistings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("./views/listings/show.ejs", { listing });
  console.log(listing);
};

module.exports.createlisitng = async (req, res, next) => {
  let items = Listing(req.body.listing);

  if (items.image) {
    items.image = JSON.parse(items.image);
  }
  const newlist = new Listing(items);
  newListing.owner = req.user._id;
  await newlist.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.rendereditform = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("./views/listings/edit.ejs", { listing });
};

module.exports.updatelisting = async (req, res) => {
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;
  let deletedlist = await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing deleted !");

  res.redirect("/listings");
};
