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


const run = async () => {
  const client = await connect();

  try {
    const collection = client.db(database).collection(tweetsCollection);
    console.log(`Total tweets: ${await collection.countDocuments()}`);
    const resultCollection = await collection.mapReduce(mapFunction, reduceFunction, { out: 'tweets_by_hours' });
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
