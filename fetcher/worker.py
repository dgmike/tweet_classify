from datetime import datetime, timedelta
from os import environ
import rabbitmq


from database import Db
from log import get_logger
from twitter_client import TwitterClient

if __name__ == '__main__':
	get_logger('worker').info('creating twitter client')

	twitter_client = TwitterClient(
		consumer_key=environ.get('TWITTER_CONSUMER_KEY', ''),
		consumer_secret=environ.get('TWITTER_CONSUMER_SECRET', ''),
		access_token_key=environ.get('TWITTER_ACCESS_TOKEN_KEY', ''),
		access_token_secret=environ.get('TWITTER_ACCESS_TOKEN_SECRET', ''),
		count_per_search=100
	)

	db = Db(
		environ.get('MONGODB_DATABASE', 'tweet_classify'),
		environ.get('MONGODB_TERMS_COLLECTION', 'terms'),
		environ.get('MONGODB_TWEETS_COLLECTION', 'tweets'),
		environ.get('MONGODB_HOST', 'localhost'),
		int(environ.get('MONGODB_PORT', '27017'))
	)

	get_logger('worker').info('fetching required terms')

	total, terms = db.terms(since=datetime.now() - timedelta(minutes=int(environ.get('FETCHER_CRON_INTERVAL', 10))))

	get_logger('worker').debug('Total of terms: %d' % total)

	for term in terms:
		get_logger('worker').debug('term: %s' % term)
		get_logger('worker').debug('fetching tweets for %s...' % term['term'])
		tweets = twitter_client.search(term['term'], term.get('lastTweetId'))

		get_logger('worker').debug("%d tweets founded" % len(tweets))
		db.insert_tweet([tweet.AsDict() for tweet in tweets])
		if len(tweets) > 0:
			db.update_term(term, tweets[0])
			rabbitmq.publish_updated_term(term, tweets[0])
