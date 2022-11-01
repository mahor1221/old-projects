module.exports.index = async (req, model, queryData, aggregateData) => {
  const Model = require(`../models/${model}`);
  let query = queryData;
  let options = { page: req.query.page || 1 };
  const count = await Model.countDocuments(query).catch(() => false);
  if (req.query.all) {
    options = { ...options, limit: count };
  } else if (req.query.limit) {
    if (req.query.limit <= count) {
      options = { ...options, limit: req.query.limit };
    } else {
      options = { ...options, limit: count };
    }
  } else {
    options = { ...options, limit: 16 };
  }
  const aggregate = Model.aggregate(aggregateData);
  const result = await Model.aggregatePaginate(aggregate, options).catch((err) => {
    if (err) {
      console.error(err);
      return false;
    }
  });
  return result;
};
