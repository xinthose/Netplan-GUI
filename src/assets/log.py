#!/usr/bin/python
# -*- coding: utf-8 -*-
# references: https://docs.python.org/2/howto/logging.html

import logging
import logging.handlers

def setup_custom_logger(name):
	# logger settings
	log_file = "/var/www/html/logs/netplan-gui-rest.log"
	log_file_max_size = 1024 * 1024 * 20 # megabytes
	log_num_backups = 3
	log_format = "%(asctime)s [%(levelname)s]: %(filename)s(%(funcName)s:%(lineno)s) >> %(message)s"
	log_date_format = "%m/%d/%Y %I:%M:%S %p"
	log_filemode = "w" # w: overwrite; a: append

	# setup logger
	# datefmt=log_date_format
	logging.basicConfig(filename=log_file, format=log_format, filemode=log_filemode ,level=logging.DEBUG)
	rotate_file = logging.handlers.RotatingFileHandler(
		log_file, maxBytes=log_file_max_size, backupCount=log_num_backups
	)
	logger = logging.getLogger(name)
	logger.addHandler(rotate_file)

	# print log messages to console
	consoleHandler = logging.StreamHandler()
	logFormatter = logging.Formatter(log_format)
	consoleHandler.setFormatter(logFormatter)
	logger.addHandler(consoleHandler)

	return logger

# source: https://docs.python.org/2/howto/logging.html
# logger.info("")		// Detailed information, typically of interest only when diagnosing problems.
# logger.debug("")		// Confirmation that things are working as expected.
# logger.warning("")	// An indication that something unexpected happened, or indicative of some problem in the near future
# logger.error("")		// Due to a more serious problem, the software has not been able to perform some function.
# logger.critical("")	// A serious error, indicating that the program itself may be unable to continue running.
