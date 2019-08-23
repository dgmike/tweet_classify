from os import environ

from crontab import CronTab
from log import get_logger

if __name__ == '__main__':
	logger = get_logger('runner')
	cron = CronTab()

	job = cron.new(command='python ./worker.py', comment='fetch and store tweets')
	job.minute.every(int(environ.get('FETCHER_CRON_INTERVAL', 10)))

	logger.info('Starting cron job:')
	logger.info(cron.render())

	for result in cron.run_scheduler():
		logger.debug('cron finished job')
