const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//
const UploadImageSchema = new Schema({
  link: { type: String, required: true },
});
UploadImageSchema.plugin(timestamps);
UploadImageSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("UploadImage", UploadImageSchema);
