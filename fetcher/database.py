from datetime import datetime

from pymongo import MongoClient

from log import get_logger


class Db:
	def __init__(self, db_name, terms_collection, tweets_collection, host='localhost', port=27017):
		self.logger = get_logger('database')
		self.logger.info('Connecting to database: mongo://%s:%s/%s', host, port, db_name)
		self.client = MongoClient(host, port)
		self.database = self.client.get_database(name=db_name)
		self.logger.info('Using collections: terms_collection=%s, tweets_collection=%s', terms_collection, tweets_collection)
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
