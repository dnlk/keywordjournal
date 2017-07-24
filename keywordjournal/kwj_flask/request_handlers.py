# Author: Daniel Kinney
# All rights reserved

import re

import flask
from flask import request

from keywordjournal.kwj_flask.app import app
from keywordjournal.kwj_flask import authentication as auth
from keywordjournal.kwj_flask.resources import post as post_resource
from keywordjournal.kwj_flask.resources import user_keyword as user_keyword_resource
from keywordjournal.kwj_flask.resources import user_keyword_arg as user_keyword_arg_resource
from keywordjournal.kwj_flask import resources


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


def _parse_post_text(raw_text):
    # TODO - dear god
    nasty_regex = r'\<span.*?kwj-args="(.*?)".*?\>(.*?)\</span'
    res = {y: eval(x.replace('&quot;', '"')) for x, y in re.findall(nasty_regex, raw_text)}
    return res


@app.route('/api/post', methods=['POST', 'DELETE'])
def post():
    '''
    POST: Create new post
    '''
    if request.method == 'POST':
        user_id = flask.session['user_id']
        post_body = request.form['post_body']

        posted_keywords = _parse_post_text(post_body)

        post_title = request.form['post_title']
        post_res = post_resource.create(user_id, post_title, post_body)

        for keyword, args in posted_keywords.items():
            resources.user_keyword_posted.create(
                user_id=user_id,
                post_id=post_res.id,
                keyword=keyword,
                args=args
            )

        return flask.redirect(flask.url_for('root'))


@app.route('/api/tags_and_args', methods=['GET'])
def tags_and_args():
    '''
    GET: Get all of a users tags along with their arguments, for consupmtion by front end.
         A future implementation will enable filtering.
    '''
    if request.method == 'GET':
        user_id = flask.session['user_id']
        res = user_keyword_resource.get_all_keywords_with_args(user_id)
        output_res = [
            {
                'key': i,
                'keyword': user_kw.keyword.word,
                'args': [
                    {'name': arg.param_name, 'type': arg.param_type}
                    for arg in user_kw.user_args
                ]
            }
            for i, user_kw in enumerate(res)
        ]
        return flask.jsonify(data=output_res)


@app.route('/api/new_arg', methods=['POST'])
def new_arg():
    user_id = flask.session['user_id']

    arg = request.json['arg']
    keyword = request.json['keyword']

    user_keyword_arg_resource.create(user_id, keyword, arg['name'], arg['type'])

    return '', 200


@app.route('/api/new_keyword', methods=['POST'])
def new_keyword():
    user_id = flask.session['user_id']

    word = request.json['keyword']

    res = resources.user_keyword.create(word, user_id)

    if res is None:
        return 'User keyword `{}` already exists'.format(word), 400
    else:
        return '', 200


@app.route('/api/new_keyword_args', methods=['POST'])
def new_keyword_args():
    user_id = flask.session['user_id']

    arg_name = request.json['name']
    arg_type = request.json['type'] or 'string'
    keyword = request.json['keyword']

    keyword_arg = resources.user_keyword_arg.create(
        user_id=user_id,
        keyword=keyword,
        arg_name=arg_name,
        arg_type=arg_type
    )

    if keyword_arg is None:
        return 'Argument {} for keyword {} already exists'.format(arg_name, keyword), 400
    else:
        return '', 200
