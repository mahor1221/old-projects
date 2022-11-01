const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
//
const CategorySchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    title: { type: String, required: true },
    image: { type: String, default: null },
});
CategorySchema.plugin(timestamps);
CategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Category", CategorySchema);
