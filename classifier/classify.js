const { Database } = require('./database');
const mapReduceTweetsPerHour = require('./mapReduceTweetsPerHour');
const mapReduceUsersAndFollowers = require('./mapReduceUsersAndFollowers');
const mapReduceHashtagsByCountries = require('./mapReduceHashtagsByCountries');

const run = async () => {
  const url = `mongodb://${process.env.MONGODB_HOST || 'localhost'}:${process.env.MONGODB_PORT || '27017'}/${process.env.MONGODB_DATABASE || ''}`;
  const database = new Database(url);
  await database.connect();

  console.log(`Total tweets to analyze: ${await database.collection('tweets').countDocuments()}`);

  await Promise
    .all([
      database.mapReduce(mapReduceTweetsPerHour).catch(err => { return err; }),
      database.mapReduce(mapReduceUsersAndFollowers).catch(err => { return err; }),
      database.mapReduce(mapReduceHashtagsByCountries).catch(err => { return err; }),
    ])
    .then(async ([tweetsPerHourCollection, usersAndFollowersCollection, hashtagsByCountriesCollection]) => {
      try {
        if (tweetsPerHourCollection.errmsg) {
          console.warn('Error running mapReduceTweetsPerHour.\n', tweetsPerHourCollection);
        } else {
          console.log(`Total hours analyzed: ${await tweetsPerHourCollection.countDocuments()}`);
        }

        if (usersAndFollowersCollection.errmsg) {
          console.warn('Error running usersAndFollowersCollection.\n', usersAndFollowersCollection);
        } else {
          await usersAndFollowersCollection.createIndex({'values':-1},{name:'followers_count_reverse_order'});
          console.log(`Total users with followers analyzed: ${await usersAndFollowersCollection.countDocuments()}`);
        }

        if (hashtagsByCountriesCollection.errmsg) {
          console.warn('Error running hashtagsByCountriesCollection.\n', hashtagsByCountriesCollection);
        } else {
          console.log(`Total hashtags analyzed: ${await hashtagsByCountriesCollection.countDocuments()}`);
        }
      } catch (err) {
        console.error('Error finalizing mapReduce.\n', err)
      }
    });

  await database.close();
};

run()
  .then(() => console.log('Finished.'))
  .catch((err) => console.error('Error running process.\n', err));
