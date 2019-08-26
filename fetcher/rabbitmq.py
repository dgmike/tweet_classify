import json

import pika
from os import environ


def connect():
	host = environ.get('RABBITMQ_HOST', 'messagery')
	connection = pika.BlockingConnection(pika.ConnectionParameters(host=host))
	return connection


def publish_updated_term(term, last_tweet):
	exchange = environ.get('RABBITMQ_EXCHANGE', 'fetch')
	exchange_type = environ.get('RABBITMQ_EXCHANGE_TYPE', 'fanout')
	message_term_fetched = environ.get('RABBITMQ_MESSAGE_TERM_FETCHED', 'term fetched')

	connection = connect()
	channel = connection.channel()
	channel.exchange_declare(exchange=exchange, exchange_type=exchange_type)

	message = {
		'message': message_term_fetched,
		'term': term['term'],
		'last_id': last_tweet.id_str,
	}
	channel.basic_publish(exchange=exchange, routing_key='fetched term', body=json.dumps(message))
	connection.close()


def publish_finished_message():
	exchange = environ.get('RABBITMQ_EXCHANGE', 'fetch')
	exchange_type = environ.get('RABBITMQ_EXCHANGE_TYPE', 'fanout')
	routing_key = environ.get('RABBITMQ_FETCH_FINISHED_ROUTING_KEY', 'fanout')

	connection = connect()
	channel = connection.channel()
	channel.exchange_declare(exchange=exchange, exchange_type=exchange_type)
	message = {
		'message': 'finished fetch process cicle',
	}
	channel.basic_publish(exchange=exchange, routing_key=routing_key, body=json.dumps(message))
	connection.close()
