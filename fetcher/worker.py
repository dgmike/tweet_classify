import os
import twitter


class TwitterClient:
	def __init__(self, consumer_key, consumer_secret, access_token_key, access_token_secret, count_per_search=15):
		self.api = twitter.Api(consumer_key, consumer_secret, access_token_key, access_token_secret)
		self.count = count_per_search

	def search(self, term):
		return self.api.GetSearch(term, count=self.count)


if __name__ == '__main__':
	print('creating client')
	twitter_client = TwitterClient(
		consumer_key=os.environ.get('TWITTER_CONSUMER_KEY', ''),
		consumer_secret=os.environ.get('TWITTER_CONSUMER_SECRET', ''),
		access_token_key=os.environ.get('TWITTER_ACCESS_TOKEN_KEY', ''),
		access_token_secret=os.environ.get('TWITTER_ACCESS_TOKEN_SECRET', ''),
		count_per_search=100
	)

	print('fetching tweets...')
	tweets = twitter_client.search('#devops')
	print("%d tweets founded" % len(tweets))
