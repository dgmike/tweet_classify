import json
import pika
from os import environ


def publish_updated_term(term, last_tweet):
	host = environ.get('RABBITMQ_HOST', 'messagery')
	exchange = environ.get('RABBITMQ_EXCHANGE', 'fetch')
	exchange_type = environ.get('RABBITMQ_EXCHANGE_TYPE', 'fanout')

	message_term_fetched = environ.get('RABBITMQ_MESSAGE_TERM_FETCHED', 'term fetched')

	connection = pika.BlockingConnection(pika.ConnectionParameters(host=host))
	channel = connection.channel()
	channel.exchange_declare(exchange=exchange, exchange_type=exchange_type)

	message = {
		'message': message_term_fetched,
		'term': term['term'],
		'last_id': last_tweet.id_str,
	}
	channel.basic_publish(exchange=exchange, routing_key='', body=json.dumps(message))
	connection.close()
