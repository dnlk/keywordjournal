# Author: Daniel Kinney
# All rights reserved

import string
import random
import datetime
import functools

import flask

from keywordjournal.kwj_flask import security

__doc__ = """
This is a non complete, non perfect login system, but it is good enough for now to work
for dev purposes.

Considering using https://pypi.python.org/pypi/itsdangerous
"""





def validate_user(email, password):
    curs = flask.g.db.cursor()
    get_pw_query = 'SELECT password FROM user WHERE email = "%s"' % email
    res = curs.execute(get_pw_query)
    try:
        hashed_pw = next(res)[0]
    except StopIteration:
        return None
    return security.validate_password(hashed_pw, password)





def setup_user_session(email):
    conn = flask.g.db
    token_str = security.gen_random_str()
    user_id_query = 'SELECT id FROM user WHERE email = "{email}"'.format(email=email)
    delete_token_query = (
            'DELETE FROM user_session WHERE user_id = ('
            'SELECT id FROM user WHERE email = "%s")' % email
        )
    curs = conn.cursor()
    # user_id = next(curs.execute('SELECT id FROM user WHERE email = "%s"' % email))[0]
    curs.execute(delete_token_query)
    insert_token_query = (
        'INSERT INTO user_session (user_id, token, created) '
        'VALUES ((SELECT id FROM user WHERE email = "{email}"), "{token}", "{datetime}")'
        .format(email=email, token=token_str, datetime=datetime.datetime.now())
    )
    curs.execute(insert_token_query)
    conn.commit()
    user_id = next(curs.execute(user_id_query))[0]
    flask.session['email'] = email
    flask.session['session_token'] = token_str
    flask.session['user_id'] = user_id
    return token_str


def request_user_session(email, password):
    if validate_user(email, password):
        new_token_str = setup_user_session(email)
        return new_token_str


def ensure_valid_user_session(request_handler_func):
    @functools.wraps(request_handler_func)
    def inner():
        email = flask.session.get('email')
        if email is None:
            return flask.redirect(flask.url_for('login'))
        session_token = flask.session.get('session_token')
        active_session_token_query = (
            'SELECT token FROM user_session WHERE user_id = ('
            'SELECT id FROM user WHERE email = "%s")' % email
        )
        conn = flask.g.db
        curs = conn.cursor()
        try:
            active_session_token = next(curs.execute(active_session_token_query))[0]
        except StopIteration:
            return flask.redirect(flask.url_for('login'))
        if not active_session_token == session_token:
            return flask.redirect(flask.url_for('login'))

        return request_handler_func()
    return inner
