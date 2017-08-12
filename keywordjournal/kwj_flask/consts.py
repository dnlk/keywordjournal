# Author: Daniel Kinney
# All rights reserved

import os

APP_NAME = 'keywordjournal'

# Config Constants
CONFIG_PATH = 'keywordjournal.config'

# Environment Variable Names
# DB_ENV_VAR = APP_NAME.upper() + '_' + 'DB_PATH'

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
KEYWORDJOURNAL_DB_PATH = os.path.join(PROJECT_ROOT, 'db/keywordjournal_db')
