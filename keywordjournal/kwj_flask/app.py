# Author: Daniel Kinney
# All rights reserved
import flask
import sqlite3

app = flask.Flask(__name__)
app.config.from_object('keywordjournal.kwj_flask.config')


def connect_db():
    print(app.config['DATABASE'])
    return sqlite3.connect(app.config['DATABASE'])


@app.before_request
def before_request():
    flask.g.db = connect_db()


@app.teardown_request
def teardown_request(exception):
    db = getattr(flask.g, 'db', None)
    if db is not None:
        db.close()
