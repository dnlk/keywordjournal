# Author: Daniel Kinney
# All rights reserved

import datetime

import flask

from keywordjournal.kwj_flask.resources import user as user_resource
from keywordjournal.kwj_flask.connection import manager
from keywordjournal.kwj_flask import authentication
from keywordjournal.kwj_flask import security

from keywordjournal.kwj_flask.models.db import UserSession


def get_by_user_id(user_id):
    res = manager.proxy_session.query(UserSession).filter_by(user_id=user_id).first()
    return res


def update(user_id, token_str):
    now = datetime.datetime.now()
    user_session = get_by_user_id(user_id)
    user_session.update({user_session.token: token_str, user_session.created: now})


def request_user_session(email, password):
    user = user_resource.get(email)
    hashed_pw = user.password
    if security.validate_password(hashed_pw, password):
        new_token_str = setup_user_session(email)
        return new_token_str


def setup_user_session(email):
    token_str = security.gen_random_str()
    user = user_resource.get(email)
    update(user.id, token_str)
    flask.session['email'] = email
    flask.session['session_token'] = token_str
    flask.session['user_id'] = user.id
    return token_str


def validate_user(email, password):
    user = user_resource.get(email)
    return security.validate_password(user.password, password)


def create(email, password):
    if validate_user(email, password):
        new_token_str = setup_user_session(email)
        return new_token_str
