const mapFunction = function () {
  emit(this.user.screen_name, {
    id: this.id,
    followers_count: this.user.followers_count,
  });
};

const reduceFunction = function (key, values) {
  return values.reduce((prev, cur) => prev.id < cur.id ? prev : cur);
};

module.exports = {
  mapFunction,
  reduceFunction,
  collection: 'tweets',
  out: 'users_followers',
};
