# Author: Daniel Kinney
# All rights reserved

import flask

from keywordjournal.models.db import User
from keywordjournal.kwj_flask.connection.manager import db


def get(email):
    user = db.query(User).filter_by(name=email).first()
    return user


def get_by_id(user_id):
    user = db.query(User).filter_by(id=user_id).first()
    return user


#todo It's probably not good to be hitting up the db for this
def get_from_session():
    email = flask.session['email']
    return get(email)
