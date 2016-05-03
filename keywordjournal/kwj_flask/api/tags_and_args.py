# Author: Daniel Kinney
# All rights reserved

import flask


#todo obviously this should not be using direct sql query
def get_tags_and_args(user_id):
    query = (
        'SELECT '
        'user_keyword_arg.param_name, user_keyword_posted_arg.param_value, keyword.word '
        'FROM '
        'user_keyword_arg, user_keyword_posted_arg, keyword, user_keyword, user_keyword_posted '
        'WHERE '
        'user_keyword.user_id = {user_id} '
        'AND keyword.id = user_keyword.keyword_id '
        'AND user_keyword_arg.user_keyword_id = user_keyword.id '
        'AND user_keyword_posted.user_keyword_id = user_keyword.id '
        'AND user_keyword_arg.user_keyword_id = user_keyword.id '
        'AND user_keyword_posted_arg.user_keyword_posted_id = user_keyword_posted.id'
    ).format(user_id=user_id)
    curs = flask.g.db
    res = curs.execute(query)
    return list(res)
