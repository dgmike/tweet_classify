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
  emit(this.user.screen_name, {
    id: this.id,
    followers_count: this.user.followers_count,
  });
};

const reduceFunction = function (key, values) {
  return values.reduce((prev, cur) => prev.id < cur.id ? prev : cur);
};

const run = async () => {
  const client = await connect();

  try {
    const collection = client.db(database).collection(tweetsCollection);
    console.log(`Total tweets: ${await collection.countDocuments()}`);
    const resultCollection = await collection.mapReduce(mapFunction, reduceFunction, { out: 'users_followers' });

    resultCollection.createIndex({'values':-1},{name:'followers_count_reverse_order'});

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
