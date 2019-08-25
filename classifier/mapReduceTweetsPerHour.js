const mapFunction = function () {
  const date = new Date(this.created_at);
  date.setMinutes(0);
  date.setSeconds(0);

  const startTime = date.toJSON();
  date.setHours(date.getHours() + 1);
  const endTime = date.toJSON();

  emit(startTime, { startTime, endTime, count: 1 });
};

const reduceFunction = function (key, values) {
  return {
    ...values[0],
    count: values.length,
  };
};

module.exports = {
  mapFunction,
  reduceFunction,
  collection: 'tweets',
  out: 'tweets_by_hours'
};
