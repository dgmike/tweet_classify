import logging
from datetime import datetime, timedelta
from http.client import HTTPConnection
from os import environ

import twitter
from pymongo import MongoClient


def memoize(f):
	memo = {}

	def helper(x):
		if x not in memo:
			memo[x] = f(x)
		return memo[x]

	return helper


@memoize
def init_logger(name):
	log = logging.getLogger(name)
	handler = logging.StreamHandler()
	formatter = logging.Formatter('%(asctime)s [%(name)-12s] %(levelname)-8s %(message)s')
	handler.setFormatter(formatter)
	log.addHandler(handler)
	log.setLevel(logging.DEBUG)
	return log


class TwitterClient:
	def __init__(self, consumer_key, consumer_secret, access_token_key, access_token_secret, count_per_search=15):
		self.api = twitter.Api(consumer_key, consumer_secret, access_token_key, access_token_secret, tweet_mode='extended')
		self.count = count_per_search
		self.logger = init_logger('TwitterClient')

	def search(self, term_to_search, last_tweet_id):
		kargs = {
			'term': term_to_search,
			'result_type': 'recent',
			'since_id': last_tweet_id,
			'include_entities': True,
			'count': self.count
		}
		self.logger.debug('API search. arguments: %r' % kargs)
		HTTPConnection.debuglevel = 1
		return self.api.GetSearch(**kargs)


class Db:
	def __init__(self, db_name, terms_collection, tweets_collection, host='localhost', port=27017):
		self.logger = init_logger('Db')
		self.logger.info('Connecting to database: mongo://%s:%s/%s', host, port, db_name)
		self.client = MongoClient(host, port)
		self.database = self.client.get_database(name=db_name)
		self.logger.info('Using collections: terms_collection=%s, tweets_collection=%s', terms_collection,
						 tweets_collection)
		self.terms_collection = self.database.get_collection(name=terms_collection)
		self.tweets_collection = self.database.get_collection(name=tweets_collection)

	def terms(self, since=None):
		query = {}
		if since:
			field = 'lastTweetTime'
			query = {'$or': [
				{field: {'$exists': False}},
				{field: {'$lt': since}}
			]}
		self.logger.info('query parameters: %r' % query)
		return self.terms_collection.count_documents(query), self.terms_collection.find(query)

	def insert_tweet(self, tweet_resources):
		for tweet in tweet_resources:
			self.tweets_collection.find_one_and_update(
				filter={'id': tweet['id']},
				update={'$set': tweet},
				upsert=True
			)

	def update_term(self, term_to_update, last_tweet):
		query = {'_id': term_to_update['_id']}
		update = {'$set': {
			'lastTweetTime': datetime.fromtimestamp(last_tweet.created_at_in_seconds),
			'lastTweetId': last_tweet.id
		}}
		self.logger.debug('updating term: query: %s, update: %s', query, update)
		self.terms_collection.update_one(query, update)


if __name__ == '__main__':
	worker_logger = init_logger('worker')
	worker_logger.info('creating twitter client')

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

	worker_logger.info('fetching required terms')

	total, terms = db.terms(since=datetime.now() - timedelta(minutes=int(environ.get('FETCHER_CRON_INTERVAL', 10))))

	worker_logger.debug('Total of terms: %d' % total)

	for term in terms:
		worker_logger.debug('term: %s' % term)
		worker_logger.debug('fetching tweets for %s...' % term['term'])
		tweets = twitter_client.search(term['term'], term.get('lastTweetId'))

		worker_logger.debug("%d tweets founded" % len(tweets))
		db.insert_tweet([tweet.AsDict() for tweet in tweets])
		if len(tweets) > 0:
			db.update_term(term, tweets[0])
