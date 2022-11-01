const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const FavoritesEpisodeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
});
FavoritesEpisodeSchema.plugin(timestamps);
FavoritesEpisodeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("FavoritesEpisode", FavoritesEpisodeSchema);
