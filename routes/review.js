const express = require("express");
const router =  express.Router({ mergeParams: true });
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/expressError.js");
const {listingSchema,reviewSchema} = require("../schema.js")
const {isLoggedin,isOwner,validateReview,validateListing,isAuthor} = require("../middleware.js");
const List = require("../model/listening.js")
const Review = require("../model/review.js")
const reviewController = require("../controllers/reviews.js");

//review post route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview))

//review delete route
router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;