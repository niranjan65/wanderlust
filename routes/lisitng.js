const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {listingSchema} = require("../schema.js");
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage})




//Index Route
router.get('/', wrapAsync(listingController.index ) );

//New Route
router.get('/new', isLoggedIn, wrapAsync( listingController.newListingForm));

//Show Route
router.get('/:id', wrapAsync(listingController.showListing ));

//Create Route
router.post('/', isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


//Edit Route
router.get('/:id/edit', isLoggedIn, isOwner,  wrapAsync(listingController.editListing));

//update Route
router.put('/:id', isLoggedIn, isOwner, upload.single('listing[image]'),  validateListing, wrapAsync(listingController.updateLisitng));

//DElete Route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));




module.exports = router;