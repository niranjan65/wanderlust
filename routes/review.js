const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review');
const { reviewSchema} = require("../schema.js");
const Listing = require('../models/listing');
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    console.log("validate review................", result);
    if(result.error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}


//Post route
router.post("/", isLoggedIn, validateReview, wrapAsync( async(req, res)=> {
    console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(newReview);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
})
);

//delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

module.exports = router