const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
//
const TagSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    title: { type: String, required: true },
    isTrend: { type: Boolean , required: true  },
});
TagSchema.plugin(timestamps);
TagSchema.plugin(mongoosePaginate);
TagSchema.plugin(aggregatePaginate);


module.exports = mongoose.model("Tag", TagSchema);
