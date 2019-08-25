const mapFunction = function () {
  const is_retweet = !!this.retweeted_status;
  const tweet = is_retweet ? this.retweeted_status : this;

  const value = {
    [this.lang]: 1,
  };

  tweet.hashtags.map(item => item.text.toLowerCase()).forEach(hashtag => {
    emit(hashtag, value);
  });
};

const reduceFunction = function (key, values) {
  const reduced_object = {};

  values.forEach(item => {
    const lang = Object.keys(item)[0];
    if (reduced_object[lang] === undefined) {
      reduced_object[lang] = 0;
    }
    reduced_object[lang] += item[lang];
  });

  return reduced_object;
};

module.exports = {
  mapFunction,
  reduceFunction,
  collection: 'tweets',
  out: 'hashtags_by_countries',
};
