# Author: Daniel Kinney
# All rights reserved

import flask
import datetime


def create_new_post(user_id, post_title, post_body):
    conn = flask.g.db
    curs = conn.cursor()
    dt = datetime.datetime.now()
    create_new_post_query = (
        'INSERT INTO post (user_id, text, header, datetime) '
        'VALUES ("{user_id}", "{post_body}", "{post_title}", "{dt}")'
        .format(user_id=user_id, post_body=post_body, post_title=post_title, dt=dt)
    )
    curs.execute(create_new_post_query)
    conn.commit()


def get_posts(user_id):
    conn = flask.g.db
    curs = conn.cursor()
    get_posts_query = (
        'SELECT header, text, datetime FROM post '
        'WHERE user_id = {user_id} '
        'ORDER BY datetime DESC'
        .format(user_id=user_id)
    )
    res = curs.execute(get_posts_query)
    return [{'post_title': pt, 'post_body': pb, 'datetime': dt} for pt, pb, dt in res]
