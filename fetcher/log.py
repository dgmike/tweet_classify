import logging


def memoize(f):
	memo = {}

	def helper(x):
		if x not in memo:
			memo[x] = f(x)
		return memo[x]

	return helper


@memoize
def get_logger(name):
	log = logging.getLogger(name)
	handler = logging.StreamHandler()
	formatter = logging.Formatter('%(asctime)s [%(name)-12s] %(levelname)-8s %(message)s')
	handler.setFormatter(formatter)
	log.addHandler(handler)
	log.setLevel(logging.DEBUG)
	return log
