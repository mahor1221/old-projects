const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
//
const LikeSchema = new Schema({
    postId : [{ type: Schema.Types.ObjectId, ref: "post" }],
});
LikeSchema.index({title: 'text', description: 'text'});
LikeSchema.plugin(timestamps);
LikeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Like", LikeSchema);
