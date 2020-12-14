const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, isReviewAuthor } = require("../middleware");

const { validateReview } = require("../schemas");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const reviewBody = req.body.review;
    reviewBody.author = req.user;
    const review = new Review(reviewBody);

    const campground = await Campground.findById(id);
    campground.reviews.push(review);

    await Promise.all([review.save(), campground.save()]);

    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Promise.all([
      Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }),
      Review.findByIdAndDelete(reviewId),
    ]);

    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
