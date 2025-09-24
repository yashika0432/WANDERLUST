const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { listingschema, reviewschema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const listingcontroller = require("../controller/listing.js");

router.get("/", wrapAsync(listingcontroller.index));

router.get("/new", isLoggedIn, listingcontroller.rendernewform);

router.get("/:id", wrapAsync(listingcontroller.showlistings));

router.post(
  "/",
  isLoggedIn,
  validatelisting,
  wrapAsync(listingcontroller.createlisitng)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.rendereditform)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validatelisting,
  wrapAsync(listingcontroller.updatelisting)
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.destroylisting)
);

module.exports = router;
