# Author: Daniel Kinney
# All rights reserved
import flask

app = flask.Flask(__name__)
app.config.from_object('KEYWORLDJOURNAL_CONFIG')

if __name__ == '__main__':
    app.run()