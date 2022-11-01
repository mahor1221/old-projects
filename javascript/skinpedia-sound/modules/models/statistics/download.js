const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const DownloadSchema = new Schema({
  episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
});
DownloadSchema.plugin(timestamps);
DownloadSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Download", DownloadSchema);
