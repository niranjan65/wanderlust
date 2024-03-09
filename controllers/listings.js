const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req, res)=> {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.newListingForm = async(req, res)=>{
 
    res.render('listings/new.ejs')
}

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        }                                                 
    }).populate("owner");
    if(!listing){
        res.redirect("/listings");
    }
    res.render('listings/show.ejs', {listing});

}

module.exports.createListing = async(req, res, next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    

    let url = req.file.path;
    let filename = req.file.filename;


    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    let savedListing = newListing.geometry = response.body.features[0].geometry;
    console.log(savedListing);
    await newListing.save();
    res.redirect("/listings");

}


module.exports.editListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing) {
        res.redirect('/listings');
    }
    let originalListing = listing.image.url;
    originalListing = originalListing.replace("/upload", "/upload/w_250")
    res.render('listings/edit.ejs', {listing, originalListing});
}

module.exports.updateLisitng = async(req, res)=>{
    let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if( typeof req.file != "undefined") {
        let url = req.files.url;
        let filename = req.files.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}