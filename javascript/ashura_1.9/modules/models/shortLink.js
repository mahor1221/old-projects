const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
//
const ShortLinkSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    link: { type: String, default: () => nanoid(5) },
});
ShortLinkSchema.index({ link: "text" });
ShortLinkSchema.plugin(timestamps);
ShortLinkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ShortLink", ShortLinkSchema);
