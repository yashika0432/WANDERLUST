const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createreview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New review created!");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyreview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted!");

  res.redirect(`/listings/${id}`);
};
