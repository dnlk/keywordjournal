# Author: Daniel Kinney
# All rights reserved

import sqlite3
import datetime
import random

WEIGHT = 'weight'
MOOD = 'mood'
USER_ID = 2
WEIGHT_USER_KEYWORD_ID = 3
MOOD_USER_KEYWORD_ID = 4
MOOD_ARG_VALUE_ID = 4
WEIGHT_ARG_KILOS_ID = 3


CREATE_POST_QUERY = 'INSERT INTO post (user_id, text, header, datetime) ' \
                    'VALUES ({user_id}, "{text}", "{header}", "{datetime}")'

CREATE_TAG_QUERY = 'INSERT INTO user_keyword_posted (user_keyword_id, post_id) ' \
                   'VALUES ({user_keyword_id}, {post_id})'

CREATE_ARG_QUERY = 'INSERT INTO user_keyword_posted_arg (user_keyword_posted_id, arg_id, param_value) ' \
                   'VALUES ({user_keyword_posted_id}, {arg_id}, "{param_value}")'


conn = sqlite3.connect('/home/dan/projects/keywordjournal/db/keywordjournal_db')
curs = conn.cursor()


def create_fake_post(user_id, dt):
    query = CREATE_POST_QUERY.format(user_id=user_id, text='', header='', datetime=dt)
    curs.execute(query)
    return curs.lastrowid


def create_fake_tag(user_keyword_id, post_id):
    tag_query = CREATE_TAG_QUERY.format(user_keyword_id=user_keyword_id, post_id=post_id)
    curs.execute(tag_query)
    return curs.lastrowid


def create_fake_arg(user_keyword_posted_id, arg_id, param_value):
    arg_query = CREATE_ARG_QUERY.format(
            user_keyword_posted_id=user_keyword_posted_id,
            arg_id=arg_id,
            param_value=param_value
    )
    curs.execute(arg_query)


def populate_time_series_mock_data(start_date, num_days):
    delta = datetime.timedelta(days=1)
    date = start_date
    for d in range(num_days):
        post_id = create_fake_post(USER_ID, date)
        tag_id = create_fake_tag(WEIGHT_USER_KEYWORD_ID, post_id)
        param_value = random.random() * 100
        create_fake_arg(tag_id, WEIGHT_ARG_KILOS_ID, param_value)
        date += delta


def populate_histogram_mock_data(date, num_values):
    MOODS = ['happy', 'sad', 'angry', 'hunry']
    for i in range(num_values):
        mood = random.choice(MOODS)
        post_id = create_fake_post(USER_ID, date)
        tag_id = create_fake_tag(MOOD_USER_KEYWORD_ID, post_id)
        create_fake_arg(tag_id, MOOD_ARG_VALUE_ID, mood)


if __name__ == '__main__':
    start_date = datetime.datetime(2016, 1, 1)
    populate_time_series_mock_data(start_date, 30)
    populate_histogram_mock_data(start_date, 90)
    conn.commit()
