import logging.config
import logging
import logging.handlers as handlers
import time
from os import path

def singleton(cls):
        instances = {}
        def get_instance():
                if cls not in instances:
                        instances[cls] = cls()
                return instances[cls]
        return get_instance()

@singleton
class Logger():
        def __init__(self):
                log_file_path = path.join(path.dirname(path.abspath(__file__)), 'logging.conf')
                logging.config.fileConfig(log_file_path)
                self.logr = logging.getLogger(__name__)
