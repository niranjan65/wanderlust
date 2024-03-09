const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

const MONGO_URL="mongodb+srv://niranjansinghhh16:niranjan123@cluster0.iydggvo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main().then(()=>{
    console.log("Connected to Db")
}).catch((error)=>{
    console.log(error)
})
async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> (  {...obj, owner: "6544a09412a925e0c75b9b78" }))
    await Listing.insertMany(initData.data);
    console.log("Data was inserted successfully");
}

initDB();
