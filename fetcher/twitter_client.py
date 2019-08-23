import twitter

from log import get_logger


class TwitterClient:
	def __init__(self, consumer_key, consumer_secret, access_token_key, access_token_secret, count_per_search=15):
		self.api = twitter.Api(consumer_key, consumer_secret, access_token_key, access_token_secret, tweet_mode='extended')
		self.count = count_per_search
		self.logger = get_logger('TwitterClient')

	def search(self, term_to_search, last_tweet_id):
		kargs = {
			'term': term_to_search,
			'result_type': 'recent',
			'since_id': last_tweet_id,
			'include_entities': True,
			'count': self.count
		}
		self.logger.debug('API search. arguments: %r' % kargs)
		return self.api.GetSearch(**kargs)
