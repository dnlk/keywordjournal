# Author: Daniel Kinney
# All rights reserved

from keywordjournal.app import app


@app.route('/')
def root():
    '''
    GET: If not logged in, redirect to login. If logged in, present a view with a box
         to enter a post and submit. Also show previous posts.
    '''
    return ''


@app.route('/login')
def login():
    '''
    GET: Present login form
    '''
    return ''


@app.route('/api/user_session')
def user_session():
    '''
    POST: Create user session (after login request)

    DELETE: Delete user session (after logout request)
    '''
    return ''
