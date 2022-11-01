const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
//
const DisLikeSchema = new Schema({
    postId : [{ type: Schema.Types.ObjectId, ref: "post" }],
});
DisLikeSchema.index({title: 'text', description: 'text'});
DisLikeSchema.plugin(timestamps);
DisLikeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("DisLike", DisLikeSchema);
