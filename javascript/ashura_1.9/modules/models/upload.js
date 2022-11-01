const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
//
const UploadSchema = new Schema({
    link: { type: String, required: true },
    
});
UploadSchema.plugin(timestamps);
UploadSchema.plugin(mongoosePaginate);
UploadSchema.plugin(aggregatePaginate);


module.exports = mongoose.model("Upload", UploadSchema);
