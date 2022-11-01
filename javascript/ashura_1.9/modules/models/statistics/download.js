const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
//
const DownloadSchema = new Schema({
    postId : [{ type: Schema.Types.ObjectId, ref: "post" }],
});
DownloadSchema.index({title: 'text', description: 'text'});
DownloadSchema.plugin(timestamps);
DownloadSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Download", DownloadSchema);
