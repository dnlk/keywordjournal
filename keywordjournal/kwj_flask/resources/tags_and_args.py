# Author: Daniel Kinney
# All rights reserved

import flask

from keywordjournal.journal_parser import parser


def create_new_tags_and_args(post, post_id):
    conn = flask.g.db
    curs = conn.cursor()
    tags_with_args = parser.find_all_keywords_with_args(post)
    select_user_keyword_query = (
        'SELECT id FROM user_keyword WHERE keyword_id = (SELECT id FROM keyword WHERE word = "{word}")'
     )
    select_keyword_arg_query = (
        'SELECT id FROM user_keyword_arg WHERE user_keyword_id = "{user_keyword_id}" AND param_name = "{param_name}"'
    )
    insert_tag_query = (
        'INSERT INTO user_keyword_posted (user_keyword_id, post_id) '
        'VALUES ("{user_keyword_id}", "{post_id}")'
    )
    insert_args_query = (
        'INSERT INTO user_keyword_posted_arg (user_keyword_posted_id, arg_id, param_value) '
        'VALUES ("{user_keyword_posted_id}", "{arg_id}", "{param_value}")'
    )
    for tag, args in tags_with_args.items():
        try:
            user_keyword_id = next(curs.execute(select_user_keyword_query.format(word=tag)))[0]
        except StopIteration:
            continue
        curs.execute(insert_tag_query.format(user_keyword_id=user_keyword_id, post_id=post_id))
        user_keyword_posted_id = curs.lastrowid
        for arg_set in args:
            for arg, value in arg_set.items():
                try:
                    user_keyword_arg_id_curs = curs.execute(
                            select_keyword_arg_query.format(user_keyword_id=user_keyword_id,
                                                            param_name=arg))
                    user_keyword_arg_id = next(user_keyword_arg_id_curs)[0]
                except IndexError:
                    continue
                curs.execute(insert_args_query.format(arg_id=user_keyword_arg_id,
                                                      user_keyword_posted_id=user_keyword_posted_id,
                                                      param_value=value))

