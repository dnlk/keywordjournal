# Author: Daniel Kinney
# All rights reserved

import os
from keywordjournal import consts

DATABASE = os.environ[consts.DB_ENV_VAR]

# todo - figure out what to do with these
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'
