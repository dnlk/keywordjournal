# Author: Daniel Kinney
# All rights reserved

import os
from keywordjournal.kwj_flask import consts

DATABASE = os.environ[consts.DB_ENV_VAR]

# todo - figure out what to do with these
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'
