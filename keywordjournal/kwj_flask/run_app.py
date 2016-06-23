# Author: Daniel Kinney
# All rights reserved

from keywordjournal.kwj_flask import app
import keywordjournal.kwj_flask.request_handlers

if __name__ == '__main__':
    app.app.run(host='0.0.0.0', debug=True)
