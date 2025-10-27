import mongoose from "mongoose";

const pincodeSchema = new mongoose.Schema({
    pincode: {type: Number, required: true},
    postOffice: {type: String, required: true},
    distance: {type: Number, required: true} // distance in kilometers
});

const Pincode = mongoose.models.pincode || mongoose.model('pincode', pincodeSchema);

export default Pincode;