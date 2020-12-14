const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const { validateCampground } = require("../schemas");
const { isLoggedIn, isAuthor } = require("../middleware");

const catchAsync = require("../utils/catchAsync");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campgroundBody = req.body.campground;
    campgroundBody.author = req.user._id;

    const campground = new Campground(campgroundBody);

    await campground.save();

    req.flash("success", "Successfully made a new campground!");
    res.redirect(`campgrounds/${campground.id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate("reviews")
      .populate("author");

    console.log(campground.author.username);

    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/details", campground);
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render("campgrounds/edit", campground);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await Campground.findByIdAndUpdate(id, req.body.campground, {
      runValidators: true,
      useFindAndModify: false,
    });

    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.get(
  "/:id/delete",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render("campgrounds/delete", campground);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
