const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/expressError.js");
const {listingSchema,reviewSchema} = require("../schema.js")
const {isLoggedin,isOwner,validateReview,validateListing,isAuthor} = require("../middleware.js");
const List = require("../model/listening.js")
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
//index route:-
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedin,listingController.renderNewForm)

router.route("/:id")
//show route
.get(wrapAsync(listingController.showListing))
//update route
.put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
//delete route
.delete(isLoggedin,isOwner,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editListing))





module.exports = router;
