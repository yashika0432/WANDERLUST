const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let alllist = await Listing.find({});
  res.render("./views/listings/index.ejs", { alllist });
};
