const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//
const UploadEpisodeSchema = new Schema({
  link: { type: String, required: true },
});
UploadEpisodeSchema.plugin(timestamps);
UploadEpisodeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("UploadEpisode", UploadEpisodeSchema);
