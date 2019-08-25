const mongodb = require('mongodb');

const url = `mongodb://${process.env.MONGODB_HOST || 'localhost'}:${process.env.MONGODB_PORT || '27017'}`;
const database = `${process.env.MONGODB_DATABASE}`;
const tweetsCollection = `${process.env.MONGODB_TWEETS_COLLECTION}`;

const connect = async () => {
  return mongodb.MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

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


const run = async () => {
  const client = await connect();

  try {
    const collection = client.db(database).collection(tweetsCollection);
    console.log(`Total tweets: ${await collection.countDocuments()}`);
    const resultCollection = await collection.mapReduce(mapFunction, reduceFunction, { out: 'hashtags_by_countries' });
    console.log(`Total hashtags: ${await resultCollection.countDocuments()}`);
  } catch (err) {
    throw new Error(`Error executing process. ${err}`);
  } finally {
    await client.close();
  }
};

run()
  .then(() => console.log('Finished.'))
  .catch((err) => console.error('Error running process.\n', err));
