from crontab import CronTab
from os import environ

cron = CronTab()

job = cron.new(command='python ./worker.py', comment='fetch and store tweets')
job.minute.every(environ.get('FETCHER_CRON_INTERVAL', 10))

for result in cron.run_scheduler():
	print(result)
