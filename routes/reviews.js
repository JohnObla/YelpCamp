const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { validateReview } = require("../schemas");

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);

    const campground = await Campground.findById(id);
    campground.reviews.push(review);

    await Promise.all([review.save(), campground.save()]);

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Promise.all([
      Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }),
      Review.findByIdAndDelete(reviewId),
    ]);

    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;