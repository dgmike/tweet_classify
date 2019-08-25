const mongodb = require('mongodb');

class Database {
  constructor(url) {
    this.url = url;
    this.client = false;
  }

  async connect() {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.client = await mongodb.MongoClient.connect(this.url, options);
  }

  collection(collectionName) {
    return this.client.db().collection(collectionName);
  }

  async mapReduce(options = {}) {
    const { collection, mapFunction, reduceFunction, finalizeFunction } = options;

    delete options.collection;
    delete options.mapFunction;
    delete options.reduceFunction;
    delete options.finalizeFunction;

    if (finalizeFunction && !options.finalize) {
      options.finalize = finalizeFunction;
    }

    return this.client.db().collection(collection).mapReduce(mapFunction, reduceFunction, options);
  }

  async close() {
    await this.client.close();
  }
}

module.exports = {
  Database,
};
