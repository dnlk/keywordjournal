# Author: Daniel Kinney
# All rights reserved

import flask
from flask import request

from keywordjournal.kwj_flask.app import app
from keywordjournal.kwj_flask import authentication as auth


@app.route('/', methods=['GET'])
@auth.ensure_valid_user_session
def root():
    '''
    GET: If not logged in, redirect to login. If logged in, present a view with a box
         to enter a post and submit. Also show previous posts.
    '''
    return flask.render_template('create_post.jinja2', email=flask.session['email'])


@app.route('/login', methods=['GET'])
def login():
    '''
    GET: Present login form
    '''
    # return flask.render_template('base_template.jinja2')
    return flask.render_template('login.jinja2')


@app.route('/api/user_session', methods=['POST', 'DELETE'])
def user_session():
    '''
    POST: Create user session (after login request)

    DELETE: Delete user session (after logout request)
    '''
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        auth.request_user_session(email, password)
        return flask.redirect(flask.url_for('root'))
    elif request.method == 'DELETE':
        pass
