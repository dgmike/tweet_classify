import logging
from os import environ

from crontab import CronTab


def init_logger(name):
	log = logging.getLogger(name)
	handler = logging.StreamHandler()
	formatter = logging.Formatter('%(asctime)s [%(name)-12s] %(levelname)-8s %(message)s')
	handler.setFormatter(formatter)
	log.addHandler(handler)
	log.setLevel(logging.DEBUG)
	return log


if __name__ == '__main__':
	logger = init_logger('runner')
	cron = CronTab()

	job = cron.new(command='python ./worker.py', comment='fetch and store tweets')
	job.minute.every(int(environ.get('FETCHER_CRON_INTERVAL', 10)))

	logger.info('Starting cron job:')
	logger.info(cron.render())

	for result in cron.run_scheduler():
		logger.debug('cron finished job')
