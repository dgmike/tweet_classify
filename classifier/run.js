const mongodb = require('mongodb');

const url = `mongodb://${process.env.MONGODB_HOST || 'localhost'}:${process.env.MONGODB_PORT || '27017'}`;
const database = `${process.env.MONGODB_DATABASE}`;
const tweetsCollection = `${process.env.MONGODB_TWEETS_COLLECTION}`;

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

mongodb.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(database);
    const collection = db.collection(tweetsCollection);

    collection.countDocuments()
      .then(total => console.log('Total tweets: ', total))
      .catch(err => {
        console.warn('Error counting objects\n', err);
        client.close();
      })
      .then(() => {
        collection
          .mapReduce(mapFunction, reduceFunction, { out: 'hashtags_by_countries' })
          .then((hashtags_by_countries) => {
            console.log('hashtags_by_countries mapReduce finished');
            hashtags_by_countries.countDocuments()
              .then(total => console.log('Total hashtags by country: ', total))
              .catch(err => console.warn('Error counting objects\n', err))
              .finally(() => client.close());
          })
          .catch(err => console.error('Erro ao tentar executar mapReduce\n', err))
          .finally(() => client.close());
      });
  })
  .catch(err => console.error('Erro ao conectar no banco\n', err));
