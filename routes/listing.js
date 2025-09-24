const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { listingschema, reviewschema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const listingcontroller = require("../controller/listing.js");

router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
    validatelisting,
    wrapAsync(listingcontroller.createlisitng)
  );

router.get("/new", isLoggedIn, listingcontroller.rendernewform);

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showlistings))
  .put(
    isLoggedIn,
    isOwner,
    validatelisting,
    wrapAsync(listingcontroller.updatelisting)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.destroylisting));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.rendereditform)
);

module.exports = router;
