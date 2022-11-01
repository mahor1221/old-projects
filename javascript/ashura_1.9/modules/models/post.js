const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
//
const PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    originalImage: { type: String, required: true },
    compressedImage: { type: String, default: null },
    alt: { type: String, default: null },
    likeCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    shortLink: [{ type: Schema.Types.ObjectId, ref: "ShortLink" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});
PostSchema.index({title: 'text', description: 'text'});
PostSchema.plugin(timestamps);
// PostSchema.plugin(mongoosePaginate);
PostSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Post", PostSchema);
