const mongoose = require('mongoose');
const Review = require("./review")

const listingSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    geometry: {
        type: {
            type: String, 
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
});

listingSchema.post("findOneAndDelete", async(listings)=>{
    if(listings) {
        await Review.deleteMany({ _id : { $in: listings.reviews}});
    }
})

module.exports = mongoose.model("Listing", listingSchema);