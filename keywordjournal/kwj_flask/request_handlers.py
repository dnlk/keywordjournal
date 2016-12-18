# Author: Daniel Kinney
# All rights reserved

import flask
from flask import request

from keywordjournal.kwj_flask.app import app
from keywordjournal.kwj_flask import authentication as auth
from keywordjournal.kwj_flask.resources import post as post_resource
from keywordjournal.kwj_flask.resources import user_keyword as user_keyword_resource
# from keywordjournal.kwj_flask.resources import tags_and_args as tags_and_args_resource


@app.route('/', methods=['GET'])
@auth.ensure_valid_user_session
def root():
    '''
    GET: If not logged in, redirect to login. If logged in, present a view with a box
         to enter a post and submit. Also show previous posts.
    '''
    user_id = flask.session['user_id']
    previous_posts = post_resource.get_all(user_id)
    return flask.render_template('create_post.jinja2',
                                 email=flask.session['email'],
                                 previous_posts=previous_posts)


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


@app.route('/api/post', methods=['POST', 'DELETE'])
def post():
    '''
    POST: Create new post
    '''
    if request.method == 'POST':
        post_body = request.form['post_body']
        post_title = request.form['post_title']
        user_id = flask.session['user_id']
        post_resource.create(user_id, post_title, post_body)
        return flask.redirect(flask.url_for('root'))


@app.route('/api/tags_and_args', methods=['GET'])
def tags_and_args():
    '''
    GET: Get all of a users tags along with their arguments, for consupmtion by front end.
         A future implementation will enable filtering.
    '''
    # TODO - this is broken
    if request.method == 'GET':
        user_id = flask.session['user_id']
        res = user_keyword_resource.get_all_keywords_with_args(user_id)
        output_res = [
            {
                'key': i,
                'keyword': user_kw.keyword.word,
                'args': [
                    {'name': arg.param_name, 'type': 'string'}
                    for arg in user_kw.user_args
                ]
            }
            for i, user_kw in enumerate(res)
        ]
        return flask.jsonify(data=output_res)
